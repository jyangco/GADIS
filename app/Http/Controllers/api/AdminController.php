<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use App\Models\AdminUser;
use App\Models\AnnexA;
use App\Models\AnnexB;
use App\Models\AnnexBGoals;
use App\Models\ActivityDetails;
use App\Models\Employee;
use App\Models\ResPub;
use App\Models\User;
use App\Models\UserRole;
use App\Models\UserProfile;

class AdminController extends Controller
{
    //login admin
    public function AdminLogin(Request $request){
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else if ($user = AdminUser::where('username', $request->username)->first()) {
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid Credentials'
                ]);
            } else {
                $token = $user->createToken($user->username,['server:admin'])->plainTextToken;
                return response()->json([
                    'status' => 200,
                    'token' => $token,
                ]);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Invalid Credentials'
            ]);
        }
    }

    //get recent logins
    public function getLogins(){
        $logHistory = DB::table('personal_access_tokens')
            ->select('name', 'created_at')
            ->whereNot('name', '=', 'Administrator')
            ->orderBy('id', 'desc')
            ->get();
        return $logHistory;
    }

    //get histories
    public function getHistories(){
        $history = DB::table('histories')
            ->select('action', 'action_by', 'action_for', 'date')
            ->orderBy('log_id', 'desc')
            ->get();
        return $history;
    }

    //get planned and actual budget per year
    public function getActualAndPlannedBudget(){
        $acts = DB::table('activity_details')
            ->join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
            ->groupBy('act_year')
            ->selectRaw('SUM(actual_budget) as direct_sum, SUM(planned_budget) as planned_sum, SUM(planned_budget) - SUM(actual_budget) as diff, act_year')
            ->orderby('act_year', 'asc')
            ->get();
        $attrib = DB::table('attrib_details')
            ->groupBy('attrib_year')
            ->selectRaw('SUM(attrib_actual_budget) as attrib_sum, SUM(attrib_planned_budget) as attrib_planned, attrib_year')
            ->orderby('attrib_year', 'asc')
            ->get();
        $planned = array();
        $actual = array();
        $year = array();
        foreach ($acts as $direct) {
            $direct_sum = $direct->direct_sum;
            $planned_sum = $direct->planned_sum;
            foreach ($attrib as $attrb) {
                $attrib_sum = $attrb->attrib_sum;
                $attrib_planned = $attrb->attrib_planned;
                if ($attrb->attrib_year == $direct->act_year) {
                    $planned[] = $planned_sum + $attrib_planned;
                    $actual[] = $direct_sum + $attrib_sum;
                    $year[] = $attrb->attrib_year;
                }
            }
        }
        return response()->json([
            'planned' => $planned,
            'actual' => $actual,
            'year' => $year
        ]);
    }

    //get all agendas
    public function gettingGADAgendas(){
        $data = DB::table('annex_a_s')
            ->select('aa_id', 'start_year', 'end_year')
            ->orderBy('aa_id', 'asc')
            ->get();
        return $data;
    }

    //get agendas per user selection
    public function getGADAgenda(Request $request){
        $validator = Validator::make($request->all(), [
            'aa_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = AnnexA::select('*')
                ->with(['goals' => function($query){
                    $query->orderBy('goal_index', 'asc');
                }])
                ->where('aa_id', '=', $request->aa_id)
                ->first();
            return $data;
        }
    }

    //updating annex A of specific agenda
    public function updateAnnexA(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'aa_id' => 'required',
                'GAD_mission' => 'required',
                'GAD_vision' => 'required',
                'GAD_goals',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                $AnnexA = DB::table('annex_a_s')
                ->where('aa_id', $request->aa_id)
                ->update([
                    'GAD_mission' => $request->GAD_mission ,
                    'GAD_vision' => $request->GAD_vision
                ]);
                if ($request->GAD_goals != null) {
                    foreach ($request->GAD_goals as $value) {
                        $exploded = explode("<br/>,", $value);
                        $AnnexAGoals = DB::table('annex_a_goals')
                        ->where('aa_id', '=', $request->aa_id)
                        ->where('goal_id', '=', $exploded[1])
                        ->update([
                            'GAD_goal' => $exploded[0],
                        ]);
                    }
                    return response()->json([
                        'status' => 200,
                        "message" => "Success!"
                    ]);
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //getting annex B of specific agenda
    public function getAgendaAnnexB($id){
        $AnnexB = AnnexB::select('annex_b_s.*', 'annex_a_s.start_year', 'annex_a_s.end_year')
                ->join('annex_a_s', 'annex_a_s.aa_id', '=', 'annex_b_s.aa_id')
                ->with(['goals' => function($q){
                $q->join('annex_a_goals', 'annex_a_goals.goal_id', '=', 'annex_b_goals.goal_id');
            }])
        ->findOrFail($id);
        return $AnnexB;
    }

    //getting annex B goals data
    public function getAnnexBDetails(Request $request){
        $validator = Validator::make($request->all(), [
            'ab_goal_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = AnnexBGoals::where('ab_goal_id', '=', $request->ab_goal_id)
            ->with(['contents' => function($query){
                $query->orderBy('ac_id','asc');
            }])
            ->with(['agenda' => function($query){
                $query->orderBy('an_id', 'asc')->with(['agenda_contents' => function($query2){
                    $query2->orderBy('agenda_id', 'asc')->with(['agenda_activities' => function($query3){
                        $query3->orderBy('aact_id', 'asc');
                    }]);
                }]);
            }])
            ->first();
            return $data;
        }
    }

    //update agenda contents
    public function updateAnnexB(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "id" => "required",
                "value" => "required",
                "type" => "required",
                "category"
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                if ($request->category == 'content') {
                    $contents = DB::table('annex_b_agenda_contents')
                    ->where('ac_id', $request->id)
                    ->update([
                        $request->type => $request->value ,
                    ]);
                    return response()->json([
                        'status' => 200,
                        "message" => "Success!"
                    ]);
                } else if ($request->category == 'agenda') {
                    $agenda = DB::table('annex_b_agendas')
                    ->where('agenda_id', $request->id)
                    ->update([
                        $request->type => $request->value ,
                    ]);
                    return response()->json([
                        'status' => 200,
                        "message" => "Success!"
                    ]);
                } else if ($request->category == 'activity') {
                    $activity = DB::table('annex_b_agenda_activities')
                    ->where('aact_id', $request->id)
                    ->update([
                        $request->type => $request->value ,
                    ]);
                    return response()->json([
                        'status' => 200,
                        "message" => "Success!"
                    ]);
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Get all planned activities
    public function getActivities(){
        $currentyr = Carbon::now('Asia/Singapore')->format('Y');
        $direct = ActivityDetails::select('act_id', 'act_year')
                ->with(['act_atitles'])
                ->where('act_year', '=', $currentyr)
                ->orderBy('act_id', 'asc')
                ->get();
        return $direct;
    }

    //getFiltered PPAs
    public function getPPAperYear(Request $request){
        $validator = Validator::make($request->all(), [
            'filterYear' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            if ($request->filterYear == "all") {
                $data = ActivityDetails::select('act_id', 'act_year')
                    ->with(['act_atitles'])
                    ->orderBy('act_year', 'asc')
                    ->orderBy('act_id', 'asc')
                    ->get();
                return $data;
            } else {
                $data = ActivityDetails::select('act_id', 'act_year')
                    ->where('act_year', $request->filterYear)
                    ->with(['act_atitles'])
                    ->orderBy('act_id', 'asc')
                    ->get();
                return $data;
            }
        }
    }

    //get individual direct PPA
    public function getPPADetails($id){
        $data = ActivityDetails::select('*')
                ->with(['act_atitles'])
                ->with(['act_abens'])
                ->with(['act_abudgets'])
                ->findOrFail($id);
        $var = $data->act_responsible_unit;
        $org = explode(", ", $var);
        return response()->json([
            'data' => $data,
            'org' => $org
        ]);
    }

    //update PPA details
    public function updatePPADetails(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'act_id' => 'required' ,
                'gad_responsible_unit' => 'required' ,
                'act_titles' => 'required' ,
                'gad_mandate' => 'required' ,
                'gad_cause' => 'required' ,
                'gad_objective' => 'required' ,
                'gad_org' => 'required' ,
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                $PPA = DB::table('activity_details')
                ->where('act_id', $request->act_id)
                ->update([
                    'act_gad_mandate' => $request->gad_mandate,
                    'act_cause_of_issue' => $request->gad_cause,
                    'act_gad_objective' => $request->gad_objective,
                    'act_relevant_org' => $request->gad_org,
                    'act_responsible_unit' => $request->gad_responsible_unit,
                ]);
                if ($request->act_titles != null) {
                    foreach ($request->act_titles as $value) {
                        $exploded = explode("<br/>,", $value);
                        $act_titles = DB::table('activity_titles')
                        ->where('act_id', '=', $request->act_id)
                        ->where('title_id', '=', $exploded[1])
                        ->update([
                            'act_title' => $exploded[0],
                        ]);
                    }
                    return response()->json([
                        'status' => 200,
                        "message" => "Success!"
                    ]);
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //get reports
    public function getReports(){
        $data = DB::table('gad_reports')
                ->select('report_id', 'report_year', 'report_type', 'status')
                ->orderBy('report_year', 'desc')
                ->get();
        return $data;
    }

    //get images
    public function getImages(){
        $event_title = DB::table('images')
            ->select('event_title')
            ->groupBy('event_title')
            ->get();
        $details = DB::table('images')
            ->select('*')
            ->get();
        return response()->json([
            'events' => $event_title,
            'images' => $details
        ]);
    }

    //deleting images
    public function deleteImage($id){
        DB::table('images')->where('image_id', $id)->delete();
        return response()->json([
            'message' => 'File Deleted',
            'status' => 200
        ]);
    }

    //getting resources and publications
    public function getResPubs(){
        #code here..
    }

    //getting the users and the saved user positions
    public function getUsers(){
        $users = DB::table('users')
                ->select( 'id','name','email','user_role','isTWG','position_name')
                ->join('user_roles', 'user_roles.user_id', '=', 'users.id')
                ->join('user_profiles', 'user_profiles.user_id', '=', 'users.id')
                ->join('positions', 'positions.position_id', '=', 'user_profiles.position_id')
                ->orderBy('positions.position_id')
                ->orderBy('id')
                ->get();
        $positions = DB::table('positions')
                    ->select('position_id', 'position_name')
                    ->get();
        return response()->json([
            'users' => $users,
            'positions' => $positions,
        ]);
    }

    //getting employees without accnt
    public function getEmployeeWithoutAccnt(){
        $employees = DB::table('employees')->select('*')->orderBy('employee_fname')->get();
        $users = DB::table('users')->pluck('name');
        foreach ($employees as $value) {
            $employeeName[] = [strtolower($value->employee_fname. " " .$value->employee_lname),$value->employee_id];
        }
        $userArray = array();
        foreach ($users as $value) {
            array_push($userArray, strtolower($value));
        }
        $resultArray = array();
        foreach ($employeeName as $value) {
            if (!in_array($value[0], $userArray)) {
                $object = ['id' => $value[1], 'name' => ucwords($value[0])];
                array_push($resultArray, $object);
            } 
        }
        return $resultArray;
    }

    //saving new user
    public function newUser(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "emp_id" => "required",
                "emp_name" => "required",
                "emp_email" => "required",
                "emp_role" => "required",
                "emp_position" => "required",
                "twg" => "required",
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                $newUser = User::create([
                    'name' => $request->emp_name,
                    'email' => $request->emp_email,
                    'password' => Hash::make('password'),
                ]);
                $newUserRole = UserRole::create([
                    'user_id' => $newUser->id,
                    'user_role' => $request->emp_role,
                    'isTWG' => $request->twg,
                ]);
                $newUserProfile = UserProfile::create([
                    'user_id' => $newUser->id,
                    'position_id' => $request->emp_position
                ]);
                DB::table('employee_with_account')->insert([
                    ['employee_id' => $request->emp_id, 'user_id' => $newUser->id]
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success!"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //getting single user
    public function getSingleUser($id){
        $user = DB::table('users')
                ->select( 'id','name','email','user_role','isTWG','position_name', 'positions.position_id')
                ->join('user_roles', 'user_roles.user_id', '=', 'users.id')
                ->join('user_profiles', 'user_profiles.user_id', '=', 'users.id')
                ->join('positions', 'positions.position_id', '=', 'user_profiles.position_id')
                ->find($id);
        return $user;
    }

    //edit user
    public function updateUser(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "emp_id" => "required",
                "emp_email" => "required",
                "emp_role" => "required",
                "emp_position" => "required",
                "twg" => "required",
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                DB::table('users')
                ->where('id', $request->emp_id)
                ->update([
                    'email' => $request->emp_email
                ]);
                DB::table('user_profiles')
                ->where('user_id', $request->emp_id)
                ->update([
                    'position_id' => $request->emp_position
                ]);
                DB::table('user_roles')
                ->where('user_id', $request->emp_id)
                ->update([
                    'user_role' => $request->emp_role,
                    'isTWG' => $request->twg
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success!"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //delete user 
    public function deleteUser($id){
        DB::table('users')->where('id', $id)->delete();
        DB::table('user_roles')->where('user_id', $id)->delete();
        DB::table('user_profiles')->where('user_id', $id)->delete();
        DB::table('employee_with_account')->where('user_id', $id)->delete();
        return response()->json([
            'message' => 'User Deleted',
            'status' => 200
        ]);
    }

    //get Employee list
    public function getEmployees(){
        $employees = DB::table('employees')
            ->select('employees.*', 'employee_with_account.user_id')
            ->leftJoin('employee_with_account', function($join) {
                $join->on('employees.employee_id', '=', 'employee_with_account.employee_id');
            })
            ->orderBy('employee_lname')
            ->get();
        return $employees;
    }

    //get specific Employee 
    public function getSingleEmployee($id){
        $employee = Employee::select('employees.*','employee_with_account.user_id','users.email')
            ->leftJoin('employee_with_account', function($join) {
                $join->on('employees.employee_id', '=', 'employee_with_account.employee_id');
            })
            ->leftJoin('users', function($join) {
                $join->on('users.id', '=', 'employee_with_account.user_id');
            })
            ->findOrFail($id);
        return $employee;
    }

    //update employee data
    public function updateEmployee(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "employee_id" => "required" ,
                "employee_fname" => "required" ,
                "employee_lname" => "required" ,
                "employee_division" => "required" ,
                "employee_sex" => "required" ,
                "employee_status" => "required" ,
                "employee_gender",
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                if ($request->employee_gender == null) {
                    DB::table('employees')
                    ->where('employee_id', $request->employee_id)
                    ->update([
                        "employee_fname" => $request->employee_fname,
                        "employee_lname" => $request->employee_lname,
                        "employee_division" => $request->employee_division,
                        "employee_sex" => $request->employee_sex,
                        "employee_status" => $request->employee_status,
                        "employee_gender" => "",
                    ]);
                } else {
                    DB::table('employees')
                    ->where('employee_id', $request->employee_id)
                    ->update([
                        "employee_fname" => $request->employee_fname,
                        "employee_lname" => $request->employee_lname,
                        "employee_division" => $request->employee_division,
                        "employee_sex" => $request->employee_sex,
                        "employee_status" => $request->employee_status,
                        "employee_gender" => $request->employee_gender,
                    ]);
                }
                return response()->json([
                    'status' => 200,
                    "message" => "Success!"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //saving new employee
    public function newEmployee(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "employee_fname" => "required" ,
                "employee_lname" => "required" ,
                "employee_division" => "required" ,
                "employee_sex" => "required" ,
                "employee_status" => "required" ,
                "employee_gender",
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                if ($request->employee_gender == null) {
                    $newEmployee = Employee::create([
                        "employee_fname" => $request->employee_fname,
                        "employee_lname" => $request->employee_lname,
                        "employee_division" => $request->employee_division,
                        "employee_sex" => $request->employee_sex,
                        "employee_status" => $request->employee_status,
                        "employee_gender" => "",
                    ]);
                } else {
                    $newEmployee = Employee::create([
                        "employee_fname" => $request->employee_fname,
                        "employee_lname" => $request->employee_lname,
                        "employee_division" => $request->employee_division,
                        "employee_sex" => $request->employee_sex,
                        "employee_status" => $request->employee_status,
                        "employee_gender" => $request->employee_gender,
                    ]);
                }
                return response()->json([
                    'status' => 200,
                    "message" => "Success!"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //reset user password
    public function resetUserPassword(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'id' => "required"
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                DB::table('users')
                    ->where('id', $request->id)
                    ->update([
                        "password" => Hash::make("password"),
                    ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success!"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //for getting planned and actual beneficiaries
    public function getActualAndPlannedBeneficiaries(){
        $acts = DB::table('activity_details')
            ->join('activity_beneficiaries', 'activity_beneficiaries.act_id', '=', 'activity_details.act_id')
            ->groupBy('act_year')
            ->selectRaw('SUM(p_beneficiary_value) as planned, SUM(a_beneficiary_value) as actual, act_year')
            ->orderby('act_year', 'asc')
            ->get();
        // return $acts;
        $planned = array();
        $actual = array();
        $year = array();
        foreach ($acts as $value) {
            $planned[] = $value->planned;
            $actual[] = $value->actual;
            $year[] = $value->act_year;
        }
        return response()->json([
            'planned' => $planned,
            'actual' => $actual,
            'year' => $year
        ]);
    }
//end of file
}

