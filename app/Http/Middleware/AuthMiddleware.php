<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
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
        if ($user[$index]->revoked === false && $user[$index]->abilities[0] === "server:admin") {
            return $next($request);
        } else {
            return response()->json([
                'message' => 'ACCESS DENIED, INVALID USER SESSION'
            ], 403);
        }
    }
}