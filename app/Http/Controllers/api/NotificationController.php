<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\Notifications;

class NotificationController extends Controller
{
    //GETTING ALL NOTIFICATIONS FUNCTION
    public function getNotif(){
        $user = Auth::user();
        $profile = DB::table('user_profiles')
                ->select('profile_id')
                ->where('user_id', '=', $user->id)
                ->first();
        $notif = DB::table('notifications')
                ->selectRaw('COUNT(*) as messages')
                ->where('profile_to', '=', $profile->profile_id)
                ->where('isViewed', '=', false)
                ->first();
        return $notif;
    }

    public function getTitle(){
        $user = Auth::user();
        $profile = DB::table('user_profiles')
            ->select('*')
            ->where('user_id', '=', $user->id)
            ->join('positions', 'positions.position_id', '=', 'user_profiles.position_id')
            ->first();
        return $profile;
    }

    //GETTING ALL MESSAGES FUNCTION
    public function getAllMessages(){
        $user = Auth::user();
        $profile = DB::table('user_profiles')->select('profile_id')->where('user_id','=',$user->id)->first();
        $notif = DB::table('notifications')
                ->select('*')
                ->where('profile_to', '=', $profile->profile_id)
                ->orderBy('notif_id', 'desc')
                ->get();
        return $notif;
    }

    //GETTING SPECIFIC MESSAGE FUNCTION
    public function getSingleMessage($id){
        $msgTo = DB::table('notifications')
                ->select('name', 'email', 'position_name')
                ->join('user_profiles', 'user_profiles.user_id', '=', 'notifications.profile_to')
                ->join('users', 'user_profiles.user_id', '=', 'users.id')
                ->join('positions', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('notif_id', '=', $id)
                ->first();
        $msgFrom = DB::table('notifications')
                ->select('name', 'email', 'position_name')
                ->join('user_profiles', 'user_profiles.user_id', '=', 'notifications.profile_from')
                ->join('users', 'user_profiles.user_id', '=', 'users.id')
                ->join('positions', 'user_profiles.position_id', '=', 'positions.position_id')
                ->where('notif_id', '=', $id)
                ->first();
        $msgBody = DB::table('notifications')
                ->select('notif_id', 'notif_title', 'notif_body', 'path', 'id_number', 'created_at')
                ->where('notif_id', '=', $id)
                ->first();
        return response()->json([
            'to' => $msgTo,
            'from' => $msgFrom,
            'content' => $msgBody
        ]);
    }

    //UPDATE NOTIFICATION STATUS
    public function updateMessage(Request $request){
        $validator = Validator::make($request->all(), [
            'notif_id',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }
        else {
            //updating notifications
            $msgBody = DB::table('notifications')
                ->where('notif_id', $request->notif_id)
                ->update(['isViewed' => 1]);
            return response()->json([
                'status' => 200,
                "message" => "Success!"
            ]);
        }
    }
}
