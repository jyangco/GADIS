<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\AnnexA;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

use App\Models\ActivityDetails;
use App\Models\AttribActivities;
use App\Models\Notifications;
use App\Models\History;
use App\Models\gadReport;
use App\Models\sddReport;

class ReportController extends Controller
{
    //send GAD Agenda for Review
    public function sendForReview(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $twg_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $agenda = AnnexA::findOrFail($request->id_number);
                $agenda->status = "For Review";
                $agenda->save();
                $notif = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $twg_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAD Agenda Submitted for Review',
                    'action_by' => $user->name,
                    'action_for' => 'GAD Agenda',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Reject back to sec
    public function sendReject(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $agenda = AnnexA::findOrFail($request->id_number);
                $agenda->status = "For Revision";
                $agenda->save();
                $notif = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAD Agenda Rejected for Revisions',
                    'action_by' => $user->name,
                    'action_for' => 'GAD Agenda',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //send to Director
    public function sendForApproval(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $execom_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'Executive Committee Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $agenda = AnnexA::findOrFail($request->id_number);
                $agenda->status = "For Approval";
                $agenda->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $execom_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => "Document is Forwarded to Executive Committee Chair for Approval",
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAD Agenda Sent for Approval',
                    'action_by' => $user->name,
                    'action_for' => 'GAD Agenda',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Approved by Director
    public function markAsApproved(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $tc_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $agenda = AnnexA::findOrFail($request->id_number);
                $agenda->status = "Approved";
                $agenda->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $tc_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAD Agenda is Approved',
                    'action_by' => $user->name,
                    'action_for' => 'GAD Agenda',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Rejected by Director
    public function rejectByExeCom(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $tc_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $agenda = AnnexA::findOrFail($request->id_number);
                $agenda->status = "For Review";
                $agenda->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $tc_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAD Agenda is Rejected for Revisions',
                    'action_by' => $user->name,
                    'action_for' => 'GAD Agenda',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Get years for drafting reports
    public function getYearforReports(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'report_type' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } else {
                if ($request->report_type === 'GPB') {
                    $data = DB::table('gad_reports')->select('report_year')->where('report_type', '=', 'GPB')->get();
                    $years = array();
                    foreach ($data as $value) {
                        $intVal = intval($value->report_year);
                        array_push($years, $intVal);
                    }
                    return $years;
                } else if ($request->report_type === 'GAR') {
                    $data = DB::table('gad_reports')->select('report_year')->where('report_type', '=', 'GAR')->get();
                    $years = array();
                    foreach ($data as $value) {
                        $intVal = intval($value->report_year);
                        array_push($years, $intVal);
                    }
                    return $years;
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Get years for creating GPB or GAR
    public function getAllYearsForReports(){
        $gpb = DB::table('gad_reports')->select('report_year')->where('report_type', '=', 'GPB')->orderBy('report_year', 'asc')->get();
        $GPByears = array();
        foreach ($gpb as $value) {
            $intVal = intval($value->report_year);
            array_push($GPByears, $intVal);
        }
        $gar = DB::table('gad_reports')->select('report_year')->where('report_type', '=', 'GAR')->orderBy('report_year', 'asc')->get();
        $GARyears = array();
        foreach ($gar as $value) {
            $intVal = intval($value->report_year);
            array_push($GARyears, $intVal);
        }
        return response()->json([
            'GPBYears' => $GPByears,
            'GARYears' => $GARyears
        ]);
    } 

    //Create new GPB Report
    public function newGPB(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'report_year',
                'report_type',
                'total_budget',
                'activity_list',
                'action_by'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                $newGADReport = gadReport::create([
                    'report_year' => $request->report_year,
                    'report_type' => $request->report_type,
                    'total_budget' => $request->total_budget,
                    'activity_list' => json_decode($request->activity_list),
                    'status' => $request->status
                ]);
                $log = History::create([
                    'action' => 'Drafted new report',
                    'action_by' => $request->action_by,
                    'action_for' => $request->report_type,
                    'id_number' => $newGADReport->report_id,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //getting Single GPB
    public function showGPB($id){
        $data1 = DB::table('gad_reports')
            ->select('report_id', 'total_budget', 'report_type', 'status', 'report_year')
            ->where('report_id', '=', $id)
            ->first();
        $data = DB::table('gad_reports')
            ->where('report_id', '=', $data1->report_id)
            ->value('activity_list', 'report_id');
        $attrib = AttribActivities::select('*')
            ->with(['attrib_adetails'])
            ->get();
        $decoded = json_decode($data, true);
        $acts = array();
            foreach ($decoded['ids'] as $value) {
            $act = ActivityDetails::select('*')
                ->where('act_id', '=', $value)
                ->with(['act_atitles'])
                ->with(['act_abens'])
                ->with(['act_abudgets'])
                ->orderBy('act_id', 'asc')
                ->first();
            array_push($acts, $act);
        }
        return response()->json([
            'Details' => $data1,
            'Acts' => $acts,
            'Attrib' => $attrib
        ]);
    }

    //Change Year for GPB
    public function getPPAsforReport(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'report_year' => 'required',
                'report_type' => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } else {
                $data1 = DB::table('gad_reports')
                    ->select('report_id', 'total_budget', 'report_type', 'status')
                    ->where('report_year', '=', $request->report_year)
                    ->where('report_type', '=', $request->report_type)
                    ->first();
                $data = DB::table('gad_reports')
                    ->where('report_id', '=', $data1->report_id)
                    ->value('activity_list', 'report_id');
                $attrib = AttribActivities::select('*')
                    ->with(['attrib_adetails'])
                    ->get();
                $decoded = json_decode($data, true);
                $acts = array();
                foreach ($decoded['ids'] as $value) {
                    $act = ActivityDetails::select('*')
                        ->where('act_id', '=', $value)
                        ->with(['act_atitles'])
                        ->with(['act_abens'])
                        ->with(['act_abudgets'])
                        ->orderBy('act_id', 'asc')
                        ->first();
                    array_push($acts, $act);
                }
                return response()->json([
                    'Details' => $data1,
                    'Acts' => $acts,
                    'Attrib' => $attrib
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Get GPB report for submission
    public function submitGPBForReview(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $twg_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400,
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "For Review";
                $report->save();
                $notif = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $twg_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GPB Submitted for Review',
                    'action_by' => $user->name,
                    'action_for' => 'GPB',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Reject GPB back to sec
    public function sendRejectGPB(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400,
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "For Revision";
                $report->save();
                $notif = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GPB Rejected for Revisions',
                    'action_by' => $user->name,
                    'action_for' => 'GPB',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //send GPB to Director
    public function sendGPBForApproval(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $execom_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'Executive Committee Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400,
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "For Approval";
                $report->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $execom_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => "Document is Forwarded to Executive Committee Chair for Approval",
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GPB Submitted for Approval',
                    'action_by' => $user->name,
                    'action_for' => 'GPB',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //GPB Approved by Director
    public function markGPBAsApproved(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $tc_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400,
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "Approved";
                $report->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $tc_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GPB is Approved',
                    'action_by' => $user->name,
                    'action_for' => 'GPB',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //GPB Rejected by Director
    public function rejectGPBByExeCom(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $tc_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400,
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "For Review";
                $report->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $tc_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GPB is Rejected for Revisions',
                    'action_by' => $user->name,
                    'action_for' => 'GPB',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Get GAR report for submission
    public function submitGARForReview(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $twg_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "For Review";
                $report->save();
                $notif = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $twg_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAR Submitted for Review',
                    'action_by' => $user->name,
                    'action_for' => 'GAR',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //Reject GAR back to sec
    public function sendRejectGAR(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "For Revision";
                $report->save();
                $notif = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAR Rejected for Revisions',
                    'action_by' => $user->name,
                    'action_for' => 'GAR',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //send GAR to Director
    public function sendGARForApproval(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $execom_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'Executive Committee Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "For Approval";
                $report->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $execom_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => "Document is Forwarded to Executive Committee Chair for Approval",
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAR Submitted for Approval',
                    'action_by' => $user->name,
                    'action_for' => 'GAR',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //GAR Approved by Director
    public function markGARAsApproved(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $tc_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "Approved";
                $report->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $tc_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAR is Approved',
                    'action_by' => $user->name,
                    'action_for' => 'GAR',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //GAR Rejected by Director
    public function rejectGARByExeCom(Request $request){
        $user = Auth::user();
        $user_profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $gs_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'GAD Secretariat')
                ->first();
        $tc_profile = DB::table('positions')
                ->select('profile_id')
                ->join('user_profiles', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('position_name', '=', 'TWG Chair')
                ->first();
        try {
            $validator = Validator::make($request->all(), [
                'notif_body' => 'required',
                'notif_title' => 'required',
                'id_number' => 'required',
                'path' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                $report = gadReport::findOrFail($request->id_number);
                $report->status = "For Review";
                $report->save();
                $notif1 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $tc_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $notif2 = Notifications::create([
                    'notif_title' => $request->notif_title,
                    'notif_body' => $request->notif_body,
                    'id_number' => $request->id_number,
                    'path' => $request->path,
                    'profile_to' => $gs_profile->profile_id,
                    'profile_from' => $user_profile->profile_id,
                ]);
                $log = History::create([
                    'action' => 'GAR is Rejected for Revisions',
                    'action_by' => $user->name,
                    'action_for' => 'GAR',
                    'id_number' => $request->id_number,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                return response()->json([
                    'status' => 200,
                    "message" => "Success"
                ]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }
    
    //add sdd Data
    public function addSDD(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'male' => 'required',
                'female' => 'required',
                'total' => 'required',
                'region' => 'required',
                'province' => 'required',
                'type' => 'required',
                'year' => 'required',
                'action_by'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400,
                ]);
            } 
            else {
                $newSDDReport = sddReport::create([
                    'male' => $request->male,
                    'female' => $request->female,
                    'total' => $request->total,
                    'region' => $request->region,
                    'province' => $request->province,
                    'type' => $request->type,
                    'year' => $request->year
                ]);
                $log = History::create([
                    'action' => 'Added SDD Data',
                    'action_by' => $request->action_by,
                    'action_for' => 'SDD',
                    'id_number' => $newSDDReport->sdd_id,
                    'date' => Carbon::now('Asia/Singapore'),
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

    //getFilterData
    public function getDataPerRegion(Request $request){
        $validator = Validator::make($request->all(), [
            'region' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = sddReport::select('*')
                ->where('region', $request->region)
                ->orderBy('year', 'desc')
                ->get();
            return $data;
        }
    }

    // end of file
}
