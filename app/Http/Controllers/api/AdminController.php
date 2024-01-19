<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Models\AdminUser;
use App\Models\AnnexA;
use App\Models\AnnexB;
use App\Models\AnnexBGoals;
use App\Models\ActivityDetails;
use App\Models\ResPub;

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
        
    }
//end of file
}

