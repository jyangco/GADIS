<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $users = Auth::user()->tokens;
        $array = [];
        foreach ($users as $val) {
            array_push($array, $val->id);
        }
        $res = 0;
        $index = 0;
        foreach($array as $v) {
            if($res < $v){
                $res = $v;
                $index = array_search($v, $array);
            }
        }
        $user = Auth::user()->tokens;
        if ($user[$index]->revoked === false && $user[$index]->abilities[0] === "server:system_admin") {
            return $next($request);
        } else {
            return response()->json([
                'message' => 'ACCESS DENIED, YOUR SESSION HAS EXPIRED'
            ], 403);
        }
    }
}
