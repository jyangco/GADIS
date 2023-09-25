<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Image;

class GalleryController extends Controller
{
    //uploading new images
    public function uploadImages(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'event_year' => 'required',
                'event_celebration' => 'required',
                'event_title' => 'required',
                'image_name' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                    'status' => 400
                ]);
            } else {
                if ($request->hasFile('image_name')) {
                    foreach ($request->file('image_name') as $image) {
                        $filename = $image->getClientOriginalName();
                        $path = ("images/Events");
                        $file_name = $path."/".$filename;
                        $image->move($path, $filename);
                        Image::create([
                            'event_year' => $request->event_year,
                            'event_celebration' => $request->event_celebration,
                            'event_title' => $request->event_title,
                            'image_name' => $file_name,
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

    //get all images
    public function getImagesYear(){
        $data = Image::select('event_year')
            ->groupBy('event_year')
            ->orderBy('event_year')
            ->get();
        return $data;
    }

    //get celebrations per year
    public function getEventCelebrations(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'filterYear'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } else {
                $data = Image::select('event_celebration')
                    ->where('event_year', '=', $request->filterYear)
                    ->groupBy('event_celebration')
                    ->get();
                return $data;
            }
        }  catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }

    //get pictures per celebrations
    public function getCelebrationPictures(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'event_year',
                'event_celebration'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'validation_errors' => $validator->messages(),
                ]);
            } else {
                $pics = Image::select('*')
                    ->where('event_year', '=', $request->event_year)
                    ->where('event_celebration', '=', $request->event_celebration)
                    ->get();
                $events = Image::select('event_title')
                    ->where('event_year', '=', $request->event_year)
                    ->where('event_celebration', '=', $request->event_celebration)
                    ->groupBy('event_title')
                    ->get();
                return response()->json([
                    'pics' => $pics,
                    'events' => $events
                ]);
            }
        }  catch(\Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], status:400);
        }
    }
}
