<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\ActivityDetails;
use App\Models\ActivityBeneficiaries;
use App\Models\History;
use Carbon\Carbon;

class BeneficiaryController extends Controller
{
    //getting individual beneficiaries
    public function getIndividualBeneficiaries($id){
        $data = ActivityDetails::select('act_id', 'act_category')->find($id);
        if ($data->act_category === "Training") {
            $act = ActivityDetails::select('activity_details.act_id', 'act_category')
                ->with(['act_atrainings' => function($q1){
                    $q1->with(['days' => function($q2){
                        $q2->with(['personnels']);
                    }]);
                }])
                ->with(['act_atitles'])
                ->with(['act_abens' => function($q){
                    $q->where('a_beneficiary_value', '=', 0);
                }])
            ->find($id);
            return $act;
        } else {
            $act = ActivityDetails::select('activity_details.act_id', 'act_category')
            ->with(['act_atitles'])
            ->with(['act_abens' => function($q){
                $q->where('a_beneficiary_value', '=', 0);
            }])
            ->find($id);
            return $act;
        }
    }

    //new beneficiary
    public function newBeneficiary(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "ben_id",
                "a_beneficiary_value",
                "a_beneficiary_target",
                "act_id",
                "action_by"
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                //updating actual outcomes of beneficiaries
                $beneficiary = ActivityBeneficiaries::findOrFail($request->ben_id);
                $beneficiary->a_beneficiary_value = $request->a_beneficiary_value;
                $beneficiary->a_beneficiary_target = $request->a_beneficiary_target;
                $beneficiary->save();
                $log = History::create([
                    'action' => 'Added Beneficiary on PPA',
                    'action_by' => $request->action_by,
                    'action_for' => 'GAD PPA',
                    'id_number' => $request->act_id,
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
}
