<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

use App\Models\User;
use App\Models\AnnexA;
use App\Models\ProfilePicture;

class AuthController extends Controller
{
    //LOGIN FUNCTION
    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else if ($user = User::where('email', $request->email)->first()) {
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid Credentials'
                ]);
            } else {
                $role = User::select('users.*', 'user_roles.user_role')->join('user_roles', 'user_roles.user_id', '=', 'users.id')->where('id', $user->id)->first();
                if ($role->user_role == 'admin') {
                    $token = $user->createToken($user->email,['server:admin'])->plainTextToken;
                    return response()->json([
                        'status' => 200,
                        'token' => $token,
                        'name' => $user->name,
                        'role' => $role->user_role
                    ]);
                } else {
                    $token = $user->createToken($user->email,['server:user'])->plainTextToken;
                    return response()->json([
                        'status' => 200,
                        'token' => $token,
                        'name' => $user->name,
                        'role' => $role->user_role
                    ]);
                }
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Invalid Credentials'
            ]);
        }
    }

    //LOGOUT FUNCTION
    public function logout(){
        $user = Auth::user();
        DB::table('personal_access_tokens')
        ->where('tokenable_id', $user->id)
        ->update(['revoked' => true]);
        return response()->json([
            'status' => 200,
            'message' => 'Bye Bye ...'
        ]);
    }

    //For getting years, to be used on GAD Agenda
    public function inclusiveYears(){
        $end_years = DB::table('annex_a_s')->select('end_year')->orderBy('end_year','desc')->first();
        if (!empty($end_years)) {
            $start = intval($end_years->end_year) + 1;
            for ( $i = 0; $i < 15; $i++) { 
                $years[] = $start + $i;
            }
            return $years;
        } else {
            $currentyr = Carbon::now('Asia/Singapore')->format('Y');
            $start = $currentyr - 2;
            for ( $i = 0; $i < 16; $i++) { 
                $years[] = $start + $i;
            }
            return $years;
        }
    }

    //For checking User position
    public function getTitle(){
        $user = Auth::user();
        $profile = DB::table('user_profiles')
            ->select('position_name', 'isTWG')
            ->where('user_profiles.user_id', '=', $user->id)
            ->join('positions', 'positions.position_id', '=', 'user_profiles.position_id')
            ->join('user_roles', 'user_roles.user_id', '=', 'user_profiles.user_id')
            ->first();
        return $profile;
    }

    //getting sec and chairs
    public function getSignatories(){
        $sec = DB::table('positions')->select('*')->where('position_name', '=', 'GAD Secretariat')->first();
        $secname = DB::table('user_profiles')
            ->select('name')
            ->where('position_id', '=', $sec->position_id)
            ->join('users', 'users.id', '=', 'user_profiles.user_id')
            ->first();
        $twgchair = DB::table('positions')->select('*')->where('position_name', '=', 'TWG Chair')->first();
        $twgchairname = DB::table('user_profiles')
            ->select('name')
            ->where('position_id', '=', $twgchair->position_id)
            ->join('users', 'users.id', '=', 'user_profiles.user_id')
            ->first();
        $execomchair = DB::table('positions')->select('*')->where('position_name', '=', 'Executive Committee Chair')->first();
        $execomchairname = DB::table('user_profiles')
            ->select('name')
            ->where('position_id', '=', $execomchair->position_id)
            ->join('users', 'users.id', '=', 'user_profiles.user_id')
            ->first();
        return response()->json([
            'GAD_Secretariat' => $secname->name,
            'TWG_Chairperson' => $twgchairname->name,
            'Executive_Committee_Chairperson' => $execomchairname->name,
        ]);
    }

    //Get entire enclusive years of GAD Agenda
    public function getYears(){
        $startYear = AnnexA::select('start_year')->orderBy('start_year', 'asc')->first();
        $endYear = AnnexA::select('end_year')->orderBy('end_year', 'desc')->first();
        $start = intval($startYear->start_year);
        $end = intval($endYear->end_year) + 1;
        $years = array();
        for ($i=$start; $i < $end ; $i++) { 
            $years[] = $i;
        }
        return $years;
    }

    //Get auth user
    public function getAuth(){
        $user = Auth::user();
        $auth = DB::table('employee_with_account')
                ->select('employees.*', 'users.id', 'users.email', 'users.name')
                ->join('employees', 'employees.employee_id', '=', 'employee_with_account.employee_id')
                ->join('users', 'users.id', '=', 'employee_with_account.user_id')
                ->where('employee_with_account.user_id', '=', $user->id)
                ->get();
        return $auth[0];
    }

    //get employee list
    public function getEmployeeNames(){
        $employees = DB::table('employees')
            ->select('employee_id', 'employee_fname', 'employee_lname', 'employee_status', 'employee_division', 'employee_sex')
            ->orderBy('employee_lname')
            ->get();
        return $employees;
    }

    //update details
    public function updateDetails(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "employee_id" => "required", 
                "employee_fname",
                "employee_lname",
                "employee_gender",
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                if ($request->employee_gender == null && $request->employee_fname == null && $request->employee_lname == null) {
                    return response()->json([
                        'status' => 304,
                        "message" => "No changes in the employee data"
                    ]);
                } else if ($request->employee_gender == null) {
                    DB::table('employees')
                    ->where('employee_id', $request->employee_id)
                    ->update([
                        "employee_fname" => $request->employee_fname,
                        "employee_lname" => $request->employee_lname,
                        "employee_gender" => "",
                    ]);
                } else if ($request->employee_fname == null && $request->employee_lname == null) {
                    DB::table('employees')
                    ->where('employee_id', $request->employee_id)
                    ->update([
                        "employee_gender" => $request->employee_gender,
                    ]);
                } else {
                    DB::table('employees')
                    ->where('employee_id', $request->employee_id)
                    ->update([
                        "employee_fname" => $request->employee_fname,
                        "employee_lname" => $request->employee_lname,
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

    //update password
    public function passwordChange(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "id" => "required", 
                "old_pass" => "required|min:8",
                "new_pass" => "required|min:8",
                "confirm_pass" => "required|min:8",
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } 
            else {
                $user = DB::table('users')->select('*')->where('id', '=', $request->id)->first();
                if (Hash::check($request->new_pass, $user->password)){
                    return response()->json([
                        'status' => 304,
                        "message" => "NEW PASSWORD cannot be the same as the OLD PASSWORD"
                    ]);
                } else if (Hash::check($request->old_pass, $user->password) && $request->new_pass == $request->confirm_pass) {
                    DB::table('users')
                    ->where('id',$request->id)
                    ->update([
                        "password" => Hash::make($request->confirm_pass),
                    ]);
                    return response()->json([
                        'status' => 200,
                        "message" => "Password Changed!"
                    ]);
                } else if (!Hash::check($request->old_pass, $user->password)){
                    return response()->json([
                        'status' => 401,
                        "message" => "Old password incorrect!"
                    ]);
                } else {
                    return response()->json([
                        'status' => 400,
                        "message" => "Something went wrong!"
                    ]);
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //update profile picture
    public function uploadProfile(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'profile_id' => 'required',
                'user_id' => 'required',
                'profile_image' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                if ($request->hasFile('profile_image')) {
                    foreach ($request->file('profile_image') as $image) {
                        $filename = $image->getClientOriginalName();
                        $path = ("images/Profile");
                        $file_name = $path."/".$filename;
                        $image->move($path, $filename);
                        ProfilePicture::create([
                            'profile_id' => $request->profile_id,
                            'user_id' => $request->user_id,
                            'profile_image' => $file_name,
                        ]);
                    }
                    return response()->json([
                        'status' => 200,
                        "message" => "File Uploaded Succesfully"
                    ]);
                } else {
                    return response()->json([
                        "message" => "File Uploading Failed"
                    ]);
                }
            }
        }  catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }
//end of file
}
