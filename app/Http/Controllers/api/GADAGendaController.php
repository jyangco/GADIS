<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

use App\Models\AnnexA;
use App\Models\AnnexAGoals;

use App\Models\AnnexB;
use App\Models\AnnexBGoals;
use App\Models\AnnexBAgendas;
use App\Models\AnnexBAgendaContent;
use App\Models\AnnexBAgendaNumber;
use App\Models\AnnexBAgendaActivities;

use App\Models\History;


class GADAGendaController extends Controller
{
    //For getting All GAD Agenda with Annex A
    public function getAgendasWithAnnexA(){
        $annexA = AnnexA::select('*')
                    ->with(['goals' => function($query){
                    }])
                    ->with(['annexB' => function($query){
                        $query->with(['goals' => function($q){
                            $q->with(['agenda' => function($q1){
                                $q1->with(['agenda_contents' => function($q2){
                                }]);
                            }]);
                        }]);
                    }])
                    ->orderBy('aa_id', 'asc')
                    ->get();
        return $annexA;
    } 

    //For creating new Annex A entry on GAD Agenda
    public function newAnnexA(Request $request){
        try {
            //Validations
            $validator = Validator::make($request->all(), [
                'start_year' => 'required',
                'end_year' => 'required',
                'GAD_vision' => 'required',
                'GAD_mission' => 'required',
                'formValues' => 'required',
                'action_by'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => 404,
                    'validation_errors' => 'Incomplete data',
                ]);
            } else {
                //AnnexA creation
                $newAnnexA = AnnexA::create([
                    'start_year' => $request->start_year,
                    'end_year' => $request->end_year,
                    'GAD_vision' => $request->GAD_vision,
                    'GAD_mission' => $request->GAD_mission,
                    'status' => 'Draft'
                ]);
                //AnnexB creation
                $annexB = AnnexB::create([
                    'aa_id' => $newAnnexA->aa_id,
                ]);
                //History Insert
                $log = History::create([
                    'action' => 'Drafted',
                    'action_by' => $request->action_by,
                    'action_for' => 'GAD Agenda',
                    'id_number' => $newAnnexA->aa_id,
                    'date' => Carbon::now('Asia/Singapore'),
                ]);
                //AnnexA goals creation
                if ($request->formValues != null) {
                    foreach ($request->formValues as $key => $value) {
                        AnnexAGoals::create([
                            'aa_id' => $newAnnexA->aa_id,
                            'goal_index' => $key+1,
                            'GAD_goal' => $value
                        ]);
                    }
                    return response()->json([
                        'status' => 200,
                        'aa_id' =>  $newAnnexA->aa_id,
                        "message" => "GAD Agenda Annex A Added, Proceed to Annex B"
                    ]);
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    } 

    //Showing individual Annex A per GAD Agenda
    public function getIndividualAnnexA ($id){
        $S_AnnexA = AnnexA::with(['annexB'])
        ->with(['goals' => function($query){
            $query->with(['annexBGoals' => function($q){
                $q->with(['contents'])
                ->with(['agenda' => function($q1){
                    $q1->with(['agenda_contents' => function($q2){
                        $q2->with(['agenda_activities']);
                    }]);
                }]);
            }]);
        }])
        ->findOrFail($id);
        return $S_AnnexA;
    }

    //For getting Annex B(p1)
    public function getAnnexBp1($id){
        // $annexB = AnnexB::join('annex_a_s', 'annex_a_s.aa_id', '=', 'annex_b_s.aa_id')
        // ->with(['goals' => function($query) {
        // }])->findOrFail($id);
        // return $annexB;
        $annexB = AnnexBGoals::select('*')
                    ->join('annex_a_goals', 'annex_a_goals.goal_id', '=', 'annex_b_goals.goal_id')
                    ->join('annex_a_s', 'annex_a_s.aa_id', '=', 'annex_a_goals.aa_id')
                    ->where('annex_b_goals.goal_id', '=', $id)
                    // ->findOrFail($id);
                    ->first();
        return $annexB;
    } 

    //For creating new Annex B(p1) entry on GAD Agenda
    public function newAnnexBp1(Request $request){
        try {
             //Validations
            $validator = Validator::make($request->all(), [
                'formValues' => 'required',
                'action_by',
                'aa_id'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } else {
                $annexBGoals = AnnexBGoals::create([
                    'ab_id' => $request->ab_id,
                    'goal_id' => $request->goal_id,
                ]);
                if ($request->formValues != null) {
                    foreach ($request->formValues as $value) {
                        $exploded = explode("<br/>,", $value);
                        AnnexBAgendaContent::create([
                            'ab_goal_id' => $annexBGoals->ab_goal_id,
                            'gender_issue' => $exploded[0],
                            'result' => $exploded[1],
                            'indicator' => $exploded[2],
                            'baseline' => $exploded[3],
                            'responsible_office' => $exploded[4]
                        ]);
                    }
                    $log = History::create([
                        'action' => 'Added Annex B',
                        'action_by' => $request->action_by,
                        'action_for' => 'GAD Agenda',
                        'id_number' => $request->aa_id,
                        'date' => Carbon::now('Asia/Singapore'),
                    ]);
                    return response()->json([
                        'status' => 200,
                        'ab_goal_id' => $annexBGoals->ab_goal_id,
                        "message" => "Data Added"
                    ]);
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    } 

    //For creating new Annex B(p2) entry on GAD Agenda
    public function newAnnexBp2(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'formValues' => 'required',
                'actValues' => 'required',
                'ab_goal_id',
                'aa_id',
                'action_by'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } else {
                $annexBNumbers = AnnexBAgendaNumber::create([
                    'ab_goal_id' => $request->ab_goal_id,
                ]);
                if ($request->formValues != null) {
                    foreach ($request->formValues as $value){
                        $exploded = explode("<br/>,", $value);
                        $annexBAgenda = AnnexBAgendas::create([
                            'an_id' => $annexBNumbers->an_id,
                            'agenda_year' => $exploded[1],
                            'agenda_target' => $exploded[2],
                            'agenda_budget' => $exploded[3],
                            'agenda_budget_for' => $exploded[4],
                        ]);
                        foreach ($request->actValues as $val) {
                            $explode = explode("<br/>,", $val);
                            if ($explode[0] == $exploded[0])
                                AnnexBAgendaActivities::create([
                                'agenda_id' => $annexBAgenda->agenda_id,
                                'activity_title' => $explode[1]
                            ]);
                        }
                    }
                    $log = History::create([
                        'action' => 'Added Annex B Annual Targets, Activities and Budgets',
                        'action_by' => $request->action_by,
                        'action_for' => 'GAD Agenda',
                        'id_number' => $request->aa_id,
                        'date' => Carbon::now('Asia/Singapore'),
                    ]);
                    return response()->json([
                        'status' => 200,
                        "message" => "Data Added"
                    ]);
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //getting ppa histories
    public function getAgendaHistory(Request $request){
        $validator = Validator::make($request->all(), [
            'aa_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = History::select('log_id', 'action', 'action_by', 'date')
                ->where('id_number', $request->aa_id)
                ->where('action_for', '=', 'GAD Agenda')
                ->orderBy('log_id', 'desc')
                ->get();
            return $data;
        }
    }

//end of file
}
