<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Models\ActivityBudgets;
use App\Models\ActivityDetails;
use App\Models\ActivityTitles;

use App\Models\AttribDetails;

use App\Models\BudgetBreakdown;

use App\Models\History;

class BudgetController extends Controller
{
    //getting individual budget and their breakdowns
    public function getIndividualBudget($id){
        $data = ActivityDetails::select('activity_details.act_id')
                ->with(['act_atitles'])
                ->with(['act_abudgets' => function($query){
                    $query->with(['act_abreakdowns']);
                }])
                ->find($id);
        return $data;
    }

    //adding breakdowns and updating the budget
    public function newBudget(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                "budget_id",
                "accumulated_budget",
                "item",
                "item_cost",
                "act_id",
                "action_by"
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } 
            else {
                //inserting budget breakdowns
                $bb = BudgetBreakdown::create([
                    "budget_id" => $request->budget_id,
                    "item" => $request->item,
                    "item_cost" => $request->item_cost,
                ]);
                //updating total cost
                $budget = ActivityBudgets::findOrFail($request->budget_id);
                $budget->actual_budget = $request->accumulated_budget;
                $budget->save();
                $log = History::create([
                    'action' => 'Added Budget on PPA',
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

    //getting all budgets
    public function BudgetList(){
        $direct = ActivityDetails::join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
                ->groupBy('act_year')
                ->selectRaw('SUM(actual_budget) as direct_sum, SUM(planned_budget) as planned_sum, act_year')
                ->orderby('act_year', 'asc')
                ->get();
        $nwmc = ActivityDetails::join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
                ->selectRaw('SUM(actual_budget) as direct_sum, SUM(planned_budget) as planned_sum')
                ->where('act_category', '=', 'NWMC')
                ->get();
        $attrib = AttribDetails::groupBy('attrib_year')
                ->selectRaw('SUM(attrib_actual_budget) as attrib_sum, SUM(attrib_planned_budget) as attrib_planned, attrib_year')
                ->get();
        return response()->json([
            'direct' => $direct,
            'attrib' => $attrib,
            'nwmc' => $nwmc
        ]);
    }

    //getting budget per year
    public function budgetPerYear(Request $request){
        $validator = Validator::make($request->all(), [
            'year' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = ActivityDetails::select('activity_details.act_id', 'budget_id', 'act_year', 'planned_budget', 'actual_budget')
                ->join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
                ->with(['act_atitles'])
                ->where('act_year', '=', $request->year)
                ->get();
            $budget = ActivityDetails::join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
                ->groupBy('act_year')
                ->selectRaw('SUM(actual_budget) as direct_sum, SUM(planned_budget) as planned_sum, act_year')
                ->where('act_year', '=', $request->year)
                ->get();
            return response()->json([
                "budget_data" => $budget,
                "act_data" => $data,
            ]);
        }
    }

    //getting budget per year for attributed
    public function budgetPerYearAttrib(Request $request){
        $validator = Validator::make($request->all(), [
            'year' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = AttribDetails::select('attrib_title', 'attrib_planned_budget', 'attrib_actual_budget', 'attrib_year')
                ->join('attrib_activities', 'attrib_details.attrib_number', '=', 'attrib_activities.attrib_title_id')
                ->where('attrib_year', '=', $request->year)
                ->get();
            $budget = AttribDetails::groupBy('attrib_year')
                ->selectRaw('SUM(attrib_actual_budget) as attrib_sum, SUM(attrib_planned_budget) as attrib_planned, attrib_year')
                ->where('attrib_year', '=', $request->year)
                ->get();
            return response()->json([
                "budget_data" => $budget,
                "act_data" => $data,
            ]);
        }
    }

    //getting breakdowns
    public function getBreakdowns($id){
        $data = ActivityBudgets::with(['act_abreakdowns'])->findOrFail($id);
        return $data;
    }

    //getting NWMC PPAs
    public function budgetPerYearNWMC(Request $request){
        $validator = Validator::make($request->all(), [
            'year' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } 
        else {
            $data = ActivityDetails::select('activity_details.act_id', 'budget_id', 'act_year', 'planned_budget', 'actual_budget')
                ->join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
                ->with(['act_atitles'])
                ->where('act_year', '=', $request->year)
                ->where('act_category', '=', 'NWMC')
                ->get();
            $budget = ActivityDetails::join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
                ->groupBy('act_year')
                ->selectRaw('SUM(actual_budget) as direct_sum, SUM(planned_budget) as planned_sum, act_year')
                ->where('act_year', '=', $request->year)
                ->where('act_category', '=', 'NWMC')
                ->get();
            return response()->json([
                "budget_data" => $budget,
                "act_data" => $data,
            ]);
        }
    }

    //budget for nwmc
    public function budgetForNWMC(){
        $data =  ActivityDetails::join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
                ->groupBy('act_year')
                ->selectRaw('SUM(actual_budget) as direct_sum, SUM(planned_budget) as planned_sum, act_year')
                ->orderby('act_year', 'asc')
                ->where('act_category', '=', 'NWMC')
                ->get();
        $budget = ActivityDetails::join('activity_budgets', 'activity_budgets.act_id', '=', 'activity_details.act_id')
                ->selectRaw('SUM(actual_budget) as direct_sum, SUM(planned_budget) as planned_sum')
                ->where('act_category', '=', 'NWMC')
                ->get();
        return response()->json([
            "budget_data" => $budget,
            "act_data" => $data,
        ]);
    }

//end of file
}
