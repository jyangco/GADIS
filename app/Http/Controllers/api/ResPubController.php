<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\ResPub;

class ResPubController extends Controller
{
    //getting all Resources and Publications
    public function getAllResPub(){
        $data = ResPub::select('*')->get();
        return $data;
    }

    //new ResPub
    public function NewRespub(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'file_type' => 'required',
                'file_category' => 'required',
                'file_subcategory' => 'required',
                'file_title' => 'required',
                'file_name',
                'file_thumbnail',
                'issuance_year'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                if($request->hasFile('file_name')) {
                    $file = $request->file('file_name');
                    $filename = $file->getClientOriginalName();
                    if ($request->file_category == "Issuances") {
                        $path = ("Files/issuances");
                    } else {
                        $path = ("Files/resources");
                    }
                    $file_name = $path."/".$filename;
                    $file->move($path, $filename);
                    
                    if ($request->hasFile('file_thumbnail')) {
                        $fileT = $request->file('file_thumbnail');
                        $filenameT = $fileT->getClientOriginalName();
                        $pathT = ("Files/thumbs");
                        $file_thumbnail = $pathT."/".$filenameT;
                        $fileT->move($pathT, $filenameT);
                        ResPub::create([
                            'file_type' => $request->file_type,
                            'file_category' => $request->file_category,
                            'file_subcategory' => $request->file_subcategory,
                            'file_title' => $request->file_title,
                            'file_name' => $file_name,
                            'file_thumbnail' => $file_thumbnail,
                            'issuance_year' => $request->issuance_year,
                        ]);
                        return response()->json([
                            "message" => "File Uploaded Succesfully",
                            "status" => 200
                        ]);
                    } else {
                        ResPub::create([
                            'file_type' => $request->file_type,
                            'file_category' => $request->file_category,
                            'file_subcategory' => $request->file_subcategory,
                            'file_title' => $request->file_title,
                            'file_name' => $file_name,
                            'file_thumbnail' => "",
                            'issuance_year' => $request->issuance_year,
                        ]);
                        return response()->json([
                            "message" => "File Uploaded Succesfully",
                            "status" => 200
                        ]);
                    }
                    
                } else {
                    if ($request->hasFile('file_thumbnail')) {
                        $fileT = $request->file('file_thumbnail');
                        $filenameT = $fileT->getClientOriginalName();
                        $pathT = ("Files/thumbs");
                        $file_thumbnail = $pathT."/".$filenameT;
                        $fileT->move($pathT, $filenameT);
                        ResPub::create([
                            'file_type' => $request->file_type,
                            'file_category' => $request->file_category,
                            'file_subcategory' => $request->file_subcategory,
                            'file_title' => $request->file_title,
                            'file_name' => $request->file_name,
                            'file_thumbnail' => $file_thumbnail,
                            'issuance_year' => $request->issuance_year,
                        ]);
                        return response()->json([
                            "message" => "File Uploaded Succesfully",
                            "status" => 200
                        ]);
                    } else {
                        ResPub::create([
                            'file_type' => $request->file_type,
                            'file_category' => $request->file_category,
                            'file_subcategory' => $request->file_subcategory,
                            'file_title' => $request->file_title,
                            'file_name' => $request->file_name,
                            'file_thumbnail' => "",
                            'issuance_year' => $request->issuance_year,
                        ]);
                        return response()->json([
                            "message" => "File Uploaded Succesfully",
                            "status" => 200
                        ]);
                    }
                }
            }
        } catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }
}
