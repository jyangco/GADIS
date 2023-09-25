<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Models\AnnexBAgendas;
use App\Models\ActivityBeneficiaries;
use App\Models\ActivityBudgets;
use App\Models\ActivityDetails;
use App\Models\ActivityTitles;
use App\Models\ppaFile;

use App\Models\AttribActivities;
use App\Models\AttribDetails;
use App\Models\History;

class PPAController extends Controller
{
    //Get all planned activities
    public function showAllActivities(){
        $currentyr = Carbon::now('Asia/Singapore')->format('Y');
        $direct = ActivityDetails::select('act_id', 'act_year', 'act_gad_mandate', 'act_cause_of_issue', 'act_gad_objective')
                ->with(['act_atitles'])
                ->where('act_year', '=', $currentyr)
                ->orderBy('act_id', 'asc')
                ->get();
        $attrib = AttribActivities::select('*')->get();
        return response()->json([
            'direct' => $direct,
            'attrib' => $attrib
        ]);
    }

    //getting data based on user filter
    public function getFilteredData(Request $request){
        $validator = Validator::make($request->all(), [
            'year' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = AnnexBAgendas::select('*')
                ->where('agenda_year', $request->year)
                ->with(['agenda_activities'])
                ->get();
            return $data;
        }
    }

    //get all attrib PPAs
    public function getAttrib(){
        $data = AttribActivities::select('*')->get();
        return $data;
    } 

    //Inserting New PPA
    public function newPPA(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'actValues' => 'required',
                'beneficiaryValues' => 'required',
                'gad_responsible_unit' => 'required',
                'ppa_category' => 'required',
                'ppa_type' => 'required',
                'gad_mandate' => 'required',
                'gad_cause' => 'required',
                'gad_objective' => 'required',
                'gad_org' => 'required',
                'gad_budget' => 'required',
                'gad_class' => 'required',
                'gad_source' => 'required',
                'gad_source_code' => 'required',
                'year' => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400,
                ]);
            } 
            else {
                //Activity Details
                $newActDetails = ActivityDetails::create([
                    'act_year' => $request->year,
                    'act_category' => $request->ppa_category,
                    'act_type' => $request->ppa_type,
                    'act_gad_mandate' => $request->gad_mandate,
                    'act_cause_of_issue' => $request->gad_cause,
                    'act_gad_objective' => $request->gad_objective,
                    'act_relevant_org' => $request->gad_org,
                    'act_responsible_unit' => $request->gad_responsible_unit,
                    'act_expense_class' => $request->gad_class,
                    'act_source' => $request->gad_source,
                    'act_source_code' => $request->gad_source_code,
                    'status' => 'For Implementation'
                ]);
                //Activity Budget
                $newActBudget = ActivityBudgets::create([
                    'act_id' => $newActDetails->act_id, 
                    'planned_budget' => $request->gad_budget,
                    'actual_budget' => 0,
                ]);
                //Activity Titles
                if ($request->actValues != null) {
                    foreach ($request->actValues as $key => $value) {
                        ActivityTitles::create([
                            'act_id' => $newActDetails->act_id ,
                            'act_title'  => $value,
                        ]);
                    }
                }
                //Activity Beneficiaries
                if ($request->beneficiaryValues != null) {
                    foreach ($request->beneficiaryValues as $key => $value) {
                        $exploded = explode("<br/>,", $value);
                        ActivityBeneficiaries::create([
                            'act_id' => $newActDetails->act_id,
                            'act_target' => $exploded[0],
                            'p_beneficiary_value' => $exploded[1],
                            'p_beneficiary_target' => $exploded[2],
                            'a_beneficiary_value' => 0,
                            'a_beneficiary_target' => "",
                        ]);
                    }
                    $log = History::create([
                        'action' => 'Started new GAD PPA',
                        'action_by' => $request->action_by,
                        'action_for' => 'GAD PPA',
                        'id_number' => $newActDetails->act_id,
                        'date' => Carbon::now('Asia/Singapore'),
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

    //getFiltered PPAs
    public function filterPPA(Request $request){
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
                $data = ActivityDetails::select('act_id', 'act_year', 'act_gad_mandate', 'act_cause_of_issue', 'act_gad_objective', 'status')
                    ->with(['act_atitles'])
                    ->orderBy('act_year', 'asc')
                    ->orderBy('act_id', 'asc')
                    ->get();
                return $data;
            } else {
                $data = ActivityDetails::select('act_id', 'act_year', 'act_gad_mandate', 'act_cause_of_issue', 'act_gad_objective', 'status')
                    ->where('act_year', $request->filterYear)
                    ->with(['act_atitles'])
                    ->orderBy('act_id', 'asc')
                    ->get();
                return $data;
            }
        }
    }

    //checking if activities are ready to be marked as done
    public function readyToBeMarked($id){
        $isReady = "";
        $beneficiary = "";
        $budget = "";
        $bens = ActivityDetails::select('activity_details.act_id')
            ->with(['act_abens' => function($q){
                $q->where('a_beneficiary_value', '=', 0);
            }])
            ->with(['act_abudgets' => function($qry){
                $qry->where('actual_budget', '=', 0);
            }])
            ->find($id);
        $ben = $bens->act_abens;
        $bud = $bens->act_abudgets;

        if (sizeof($ben)) {
            //no beneficiary
            $beneficiary = "no";
        } else {
            //with beneficiary
            $beneficiary = "yes";
        }

        if (empty($bud)) {
            //with budget
            $budget = "yes";
        } else {
            //no budget
            $budget = "no";
        }

        if ($budget == "yes" && $beneficiary == "yes") {
            //ready
            $isReady = "yes";
        } elseif ($budget == "no" && $beneficiary == "yes") {
            //ready
            $isReady = "yes(no budget)";
        } elseif ($budget == "yes" && $beneficiary == "no") {
            //not ready
            $isReady = "no";
        } elseif ($budget == "no" && $beneficiary == "no") {
            //not ready
            $isReady = "no";
        }
        return $isReady;
    }

    //get individual direct PPA
    public function showDirectPPA($id){
        $data = ActivityDetails::select('*')
                ->with(['act_atitles'])
                ->with(['act_abens'])
                ->with(['act_abudgets'])
                ->find($id);
        return $data;
    }

    //insert new status for Direct PPA
    public function newDirectPPAStatus(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'ppa_id',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                $updatePPA = DB::table('activity_details')
                    ->where('act_id', $request->ppa_id)
                    ->update(['status' => 'Ongoing']);
                $log = History::create([
                    'action' => 'Implemented GAD PPA',
                    'action_by' => $request->action_by,
                    'action_for' => 'GAD PPA',
                    'id_number' => $request->ppa_id,
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

    public function newDirectCompletedStatus(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'ppa_id',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                $updatePPA = DB::table('activity_details')
                    ->where('act_id', $request->ppa_id)
                    ->update(['status' => 'Done']);
                $log = History::create([
                    'action' => 'Marked PPA as Complete',
                    'action_by' => $request->action_by,
                    'action_for' => 'GAD PPA',
                    'id_number' => $request->ppa_id,
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

    //adding new status for incomplete PPA
    public function newDirectIncompleteStatus(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'ppa_id',
                'status' => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                $updatePPA = DB::table('activity_details')
                    ->where('act_id', $request->ppa_id)
                    ->update(['status' => $request->status]);
                $log = History::create([
                    'action' => 'Marked PPA as Not Done',
                    'action_by' => $request->action_by,
                    'action_for' => 'GAD PPA',
                    'id_number' => $request->ppa_id,
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

    //getting ppa histories
    public function getPPAHistory(Request $request){
        $validator = Validator::make($request->all(), [
            'act_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = History::select('log_id', 'action', 'action_by', 'date')
                ->where('id_number', $request->act_id)
                ->where('action_for', '=', 'GAD PPA')
                ->orderBy('log_id', 'desc')
                ->get();
            return $data;
        }
    }

    //get individual Attributed PPA
    public function showAttributedPPA($id){
        $data = AttribActivities::select('*')
                ->with(['attrib_adetails' => function($query){
                    $query->leftjoin('ppa_files', 'ppa_files.ppa_id', '=', 'attrib_details.attrib_id');
                }])
                ->find($id);
        return $data;
    }

    //insert new Attributed activity
    public function newAttrib(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'attrib_title' => 'required',
                'attrib_year' => 'required',
                'attrib_responsible_unit' => 'required',
                'attrib_budget' => 'required',
                'attrib_class' => 'required',
                'attrib_source' => 'required',
                'attrib_source_code' => 'required',
                'action_by'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400,
                ]);
            } 
            else {
                $attrib_acts = AttribActivities::select('attrib_title')->get();
                $a1 = array();
                foreach ($attrib_acts as $value) {
                    array_push($a1, $value->attrib_title);
                }
                $a2 = [$request->attrib_title];
                $result = array_intersect($a1,$a2);
                //if $result returns an empty array the activity title is newly added
                if (!empty($result)) {
                    //get the id of the activity and insert to attrib details table
                    $attribActs = AttribActivities::select('*')->where('attrib_title', 'LIKE', $result)->first();
                    // return $attribActs;
                    $newAttribDetails = AttribDetails::create([
                        'attrib_number' => $attribActs->attrib_title_id,
                        'attrib_year' => $request->attrib_year,
                        'attrib_responsible_unit' => $request->attrib_responsible_unit,
                        'attrib_planned_budget' => $request->attrib_budget,
                        'attrib_actual_budget' => 0,
                        'attrib_class' => $request->attrib_class,
                        'attrib_source' => $request->attrib_source,
                        'attrib_source_code' => $request->attrib_source_code,
                        'status' => "For Implementation"
                    ]);
                    // $log = History::create([
                    //     'action' => 'Started new Attributed GAD PPA',
                    //     'action_by' => $request->action_by,
                    //     'action_for' => 'GAD PPA Attributed',
                    //     'id_number' => $attribActs->attrib_title_id,
                    //     'date' => Carbon::now('Asia/Singapore'),
                    // ]);
                    return response()->json([
                        'status' => 200,
                        "message" => "Success!"
                    ]);
                } else {
                    //insert the activity to the attrib activity list then proceed to attrib details
                    $newAttribAct = AttribActivities::create([
                        'attrib_title' => $request->attrib_title
                    ]);
                    $newAttribDetails = AttribDetails::create([
                        'attrib_number' => $newAttribAct->attrib_title_id,
                        'attrib_year' => $request->attrib_year,
                        'attrib_responsible_unit' => $request->attrib_responsible_unit,
                        'attrib_planned_budget' => $request->attrib_budget,
                        'attrib_actual_budget' => 0,
                        'attrib_class' => $request->attrib_class,
                        'attrib_source' => $request->attrib_source,
                        'attrib_source_code' => $request->attrib_source_code,
                        'status' => "For Implementation"
                    ]);
                    $log = History::create([
                        'action' => 'Started new Attributed GAD PPA',
                        'action_by' => $request->action_by,
                        'action_for' => 'GAD PPA Attributed',
                        'id_number' => $newAttribAct->attrib_title_id,
                        'date' => Carbon::now('Asia/Singapore'),
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

    //newHGDG
    public function newHGDG(Request $request){
        try {
            if($request->hasFile('ppa_file_path')) {
                $file = $request->file('ppa_file_path');
                $filename = $file->getClientOriginalName();
                $path = ("Files/ppas");
                $file_name = $path."/".$filename;
                $file->move($path, $filename);
                ppaFile::create([
                    'ppa_id' => $request->ppa_id,
                    'ppa_file_title' => $request->ppa_file_title,
                    'ppa_file_path' => $file_name
                ]);
                return response()->json(["message" => "Inserted"]);
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }
    //update Attributed
    public function updateAttrib(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'attrib_actual_budget',
                'ppa_id'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                //updating budget
                $attribDetails = DB::table('attrib_details')
                ->where('attrib_id', $request->ppa_id)
                ->update([
                    'attrib_actual_budget' => $request->attrib_actual_budget ,
                    'status' => 'Done'
                ]);
                // $attribDetails->attrib_actual_budget = $request->attrib_actual_budget;
                // $attribDetails->status = "Done";
                // $attribDetails->save();
                // $log = History::create([
                //     'action' => 'Started new Attributed GAD PPA',
                //     'action_by' => $request->action_by,
                //     'action_for' => 'GAD PPA Attributed',
                //     'id_number' => $attribDetails->attrib_number,
                //     'date' => Carbon::now('Asia/Singapore'),
                // ]);
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

    //getting all activities and their status
    public function getPPAStatus(){
        $currentyr = Carbon::now('Asia/Singapore')->format('Y');
        $direct = ActivityDetails::select('act_id', 'act_year','status')
                ->with(['act_atitles'])
                ->where('act_year', '=', $currentyr)
                ->orderBy('act_id', 'asc')
                ->get();
        $attrib = AttribDetails::select('attrib_id', 'attrib_number', 'attrib_year','attrib_title')
                ->join('attrib_activities', 'attrib_activities.attrib_title_id', '=', 'attrib_details.attrib_number')
                ->where('attrib_year', '=', $currentyr)
                ->orderBy('attrib_id', 'asc')
                ->get();
        return response()->json([
            'direct' => $direct,
            'attrib' => $attrib
        ]);
    }

    //filtering for PPA statuses
    public function filterStatus(Request $request){
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
                $direct = ActivityDetails::select('act_id', 'act_year', 'status')
                    ->with(['act_atitles'])
                    ->orderBy('act_year', 'asc')
                    ->get();
                $attrib = AttribDetails::select('attrib_id', 'attrib_number', 'attrib_year', 'attrib_title')
                    ->join('attrib_activities', 'attrib_activities.attrib_title_id', '=', 'attrib_details.attrib_number')
                    ->orderBy('attrib_id', 'asc')
                    ->get();
                return response()->json([
                    'direct' => $direct,
                    'attrib' => $attrib
                ]);
            } else {
                $direct = ActivityDetails::select('act_id', 'act_year', 'status')
                    ->with(['act_atitles'])
                    ->where('act_year', '=', $request->filterYear)
                    ->orderBy('act_year', 'asc')
                    ->get();
                $attrib = AttribDetails::select('attrib_id', 'attrib_number', 'attrib_year','attrib_title')
                    ->join('attrib_activities', 'attrib_activities.attrib_title_id', '=', 'attrib_details.attrib_number')
                    ->where('attrib_year', '=', $request->filterYear)
                    ->orderBy('attrib_id', 'asc')
                    ->get();
                return response()->json([
                    'direct' => $direct,
                    'attrib' => $attrib
                ]);
            }
        }
    }

    //getting complete details of all activities
    public function getAllDetails(){
        $direct = ActivityDetails::select('*')
                ->with(['act_atitles'])
                ->with(['act_abens'])
                ->with(['act_abudgets'])
                ->orderBy('act_id', 'asc')
                ->get();
        return response()->json([
            'direct' => $direct
        ]);
    }

    //getting duplicate data
    public function getDuplicateData(){
        $mandate = ActivityDetails::select('act_gad_mandate')->groupBy('act_gad_mandate')->get();
        $cause = ActivityDetails::select('act_cause_of_issue')->groupBy('act_cause_of_issue')->get();
        $objective = ActivityDetails::select('act_gad_objective')->groupBy('act_gad_objective')->get();
        return response()->json([
            'mandate' => $mandate,
            'cause' => $cause,
            'objective' => $objective
        ]);
    }

    //getting all gad issues
    public function getIssues(){
        $mandates = ActivityDetails::select('act_gad_mandate')
            ->groupBy('act_gad_mandate')
            ->get();
        return $mandates;
    }

    //getting years the issue is used and the activities or interventions
    public function getActPerMandates(Request $request){
        $validator = Validator::make($request->all(), [
            'mandate' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = ActivityDetails::select('act_gad_mandate', 'act_year', DB::raw('COUNT(*) as count'))
                ->where('act_gad_mandate', '=', $request->mandate)
                ->groupBy('act_gad_mandate', 'act_year')
                ->get();
            // return $data;
            $years = array();
            foreach ($data as $key => $value) {
                $yr = $value->act_year;
                array_push($years, $yr);
                $mandate = $value->act_gad_mandate;
                $acts[$key] = ActivityDetails::select('act_id', 'act_gad_mandate', 'act_cause_of_issue', 'act_gad_objective', 'act_year')
                    ->with(['act_atitles'])
                    ->with(['act_abens'])
                    ->where('act_gad_mandate', '=', $mandate)
                    ->where('act_year', '=', $yr)
                    ->get();
                }
            return response()->json([
                'years' => $years,
                'details' => $acts,
            ]);
        }
    }

    //end of file
}   
