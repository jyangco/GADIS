<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| api Routes
|--------------------------------------------------------------------------
|
| Here is where you can register api routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', 'App\Http\Controllers\api\AuthController@login');
Route::post('/AdminLogin', 'App\Http\Controllers\api\AdminController@AdminLogin');

Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('/authentication', function() {
        return response()->json(['message'=>'You are Authenticated','status'=>200], 200);
    });
    Route::post('/logout', 'App\Http\Controllers\api\AuthController@logout');
    Route::post('/updateDetails', 'App\Http\Controllers\api\AuthController@updateDetails');
    Route::post('/passwordChange', 'App\Http\Controllers\api\AuthController@passwordChange');
    Route::post('/uploadProfile', 'App\Http\Controllers\api\AuthController@uploadProfile');
    
    Route::get('/getTitle', 'App\Http\Controllers\api\AuthController@getTitle');
    Route::get('/inclusiveYears', 'App\Http\Controllers\api\AuthController@inclusiveYears');
    Route::get('/getSignatories', 'App\Http\Controllers\api\AuthController@getSignatories');
    Route::get('/getYears', 'App\Http\Controllers\api\AuthController@getYears');
    Route::get('/getAuth', 'App\Http\Controllers\api\AuthController@getAuth');
    Route::get('/getEmployeeNames', 'App\Http\Controllers\api\AuthController@getEmployeeNames');

    //NOTIFICATIONS
    Route::get('/getNotif', 'App\Http\Controllers\api\NotificationController@getNotif');
    Route::get('/getAllMessages', 'App\Http\Controllers\api\NotificationController@getAllMessages');
    Route::get('/getSingleMessage/{id}', 'App\Http\Controllers\api\NotificationController@getSingleMessage');
    Route::post('/updateMessage', 'App\Http\Controllers\api\NotificationController@updateMessage');

    //GAD AGENDA
    Route::get('/getAgendasWithAnnexA', 'App\Http\Controllers\api\GADAGendaController@getAgendasWithAnnexA');
    Route::get('/getIndividualAnnexA/{id}', 'App\Http\Controllers\api\GADAGendaController@getIndividualAnnexA');
    Route::get('/getAnnexBp1/{id}', 'App\Http\Controllers\api\GADAGendaController@getAnnexBp1');
    Route::post('/newAnnexA', 'App\Http\Controllers\api\GADAGendaController@newAnnexA');
    Route::post('/newAnnexBp1', 'App\Http\Controllers\api\GADAGendaController@newAnnexBp1');
    Route::post('/newAnnexBp2', 'App\Http\Controllers\api\GADAGendaController@newAnnexBp2');
    Route::post('/getAgendaHistory', 'App\Http\Controllers\api\GADAGendaController@getAgendaHistory');

    //PPAs
    Route::get('/showAllActivities', 'App\Http\Controllers\api\PPAController@showAllActivities');
    Route::get('/getPPAStatus', 'App\Http\Controllers\api\PPAController@getPPAStatus');
    Route::get('/getAttrib', 'App\Http\Controllers\api\PPAController@getAttrib');
    Route::get('/readyToBeMarked/{id}', 'App\Http\Controllers\api\PPAController@readyToBeMarked');
    Route::get('/showDirectPPA/{id}', 'App\Http\Controllers\api\PPAController@showDirectPPA');
    Route::get('/showAttributedPPA/{id}', 'App\Http\Controllers\api\PPAController@showAttributedPPA');
    Route::get('/getDuplicateData', 'App\Http\Controllers\api\PPAController@getDuplicateData');
    Route::get('/getIssues', 'App\Http\Controllers\api\PPAController@getIssues');
    Route::post('/getActPerMandates', 'App\Http\Controllers\api\PPAController@getActPerMandates');
    Route::post('/newPPA', 'App\Http\Controllers\api\PPAController@newPPA');
    Route::post('/newAttrib', 'App\Http\Controllers\api\PPAController@newAttrib');
    Route::post('/getFilteredData', 'App\Http\Controllers\api\PPAController@getFilteredData');
    Route::post('/filterPPA', 'App\Http\Controllers\api\PPAController@filterPPA');
    Route::post('/newDirectPPAStatus', 'App\Http\Controllers\api\PPAController@newDirectPPAStatus');
    Route::post('/newDirectCompletedStatus', 'App\Http\Controllers\api\PPAController@newDirectCompletedStatus');
    Route::post('/getPPAHistory', 'App\Http\Controllers\api\PPAController@getPPAHistory');
    Route::post('/newHGDG', 'App\Http\Controllers\api\PPAController@newHGDG');
    Route::post('/updateAttrib', 'App\Http\Controllers\api\PPAController@updateAttrib');
    Route::post('/filterStatus', 'App\Http\Controllers\api\PPAController@filterStatus');

    //REPORTS
    //GAD Agenda
    Route::post('/sendForReview', 'App\Http\Controllers\api\ReportController@sendForReview');
    Route::post('/sendReject', 'App\Http\Controllers\api\ReportController@sendReject');
    Route::post('/sendForApproval', 'App\Http\Controllers\api\ReportController@sendForApproval');
    Route::post('/markAsApproved', 'App\Http\Controllers\api\ReportController@markAsApproved');
    Route::post('/rejectByExeCom', 'App\Http\Controllers\api\ReportController@rejectByExeCom');
    Route::post('/newGPB', 'App\Http\Controllers\api\ReportController@newGPB');
    Route::post('/getYearforReports', 'App\Http\Controllers\api\ReportController@getYearforReports');
    Route::post('/getPPAsforReport', 'App\Http\Controllers\api\ReportController@getPPAsforReport');
    Route::post('/submitGPBForReview', 'App\Http\Controllers\api\ReportController@submitGPBForReview');
    Route::post('/sendRejectGPB', 'App\Http\Controllers\api\ReportController@sendRejectGPB');
    Route::post('/sendGPBForApproval', 'App\Http\Controllers\api\ReportController@sendGPBForApproval');
    Route::post('/markGPBAsApproved', 'App\Http\Controllers\api\ReportController@markGPBAsApproved');
    Route::post('/rejectGPBByExeCom', 'App\Http\Controllers\api\ReportController@rejectGPBByExeCom');
    Route::post('/submitGARForReview', 'App\Http\Controllers\api\ReportController@submitGARForReview');
    Route::post('/sendRejectGAR', 'App\Http\Controllers\api\ReportController@sendRejectGAR');
    Route::post('/sendGARForApproval', 'App\Http\Controllers\api\ReportController@sendGARForApproval');
    Route::post('/markGARAsApproved', 'App\Http\Controllers\api\ReportController@markGARAsApproved');
    Route::post('/rejectGARByExeCom', 'App\Http\Controllers\api\ReportController@rejectGARByExeCom');
    
    Route::get('/getAllYearsForReports', 'App\Http\Controllers\api\ReportController@getAllYearsForReports');
    Route::get('/showGPB/{id}', 'App\Http\Controllers\api\ReportController@showGPB');

    //SDD
    Route::post('/newSDD', 'App\Http\Controllers\api\ReportController@addSDD');
    Route::post('/getDataPerRegion', 'App\Http\Controllers\api\ReportController@getDataPerRegion');

    //GAR AND GPB
    Route::get('/getAllDetails', 'App\Http\Controllers\api\PPAController@getAllDetails');

    //FOR BENEFICIARIES
    Route::get('/getIndividualBeneficiaries/{id}', 'App\Http\Controllers\api\BeneficiaryController@getIndividualBeneficiaries');
    Route::post('/newBeneficiary', 'App\Http\Controllers\api\BeneficiaryController@newBeneficiary');

    //FOR BUDGET
    Route::get('/getIndividualBudget/{id}', 'App\Http\Controllers\api\BudgetController@getIndividualBudget');
    Route::get('/getBreakdowns/{id}', 'App\Http\Controllers\api\BudgetController@getBreakdowns');
    Route::get('/BudgetList', 'App\Http\Controllers\api\BudgetController@BudgetList');
    Route::get('/budgetForNWMC', 'App\Http\Controllers\api\BudgetController@budgetForNWMC');
    Route::post('/newBudget', 'App\Http\Controllers\api\BudgetController@newBudget');
    Route::post('/budgetPerYear', 'App\Http\Controllers\api\BudgetController@budgetPerYear');
    Route::post('/budgetPerYearAttrib', 'App\Http\Controllers\api\BudgetController@budgetPerYearAttrib');
    Route::post('/budgetPerYearNWMC', 'App\Http\Controllers\api\BudgetController@budgetPerYearNWMC');

    //FOR RES-PUBS
    Route::get('/getAllResPub', 'App\Http\Controllers\api\ResPubController@getAllResPub');
    Route::post('/NewRespub', 'App\Http\Controllers\api\ResPubController@NewRespub');

    //FOR GALLERY
    Route::get('/getImagesYear', 'App\Http\Controllers\api\GalleryController@getImagesYear');
    Route::post('/getEventCelebrations', 'App\Http\Controllers\api\GalleryController@getEventCelebrations');
    Route::post('/getCelebrationPictures', 'App\Http\Controllers\api\GalleryController@getCelebrationPictures');
    Route::post('/uploadImages', 'App\Http\Controllers\api\GalleryController@uploadImages');

    //DASHBOARD
    Route::get('/getEmployeeNumber', 'App\Http\Controllers\api\DashboardController@getEmployeeNumber');
    Route::get('/getSexByDivision', 'App\Http\Controllers\api\DashboardController@getSexByDivision');

    //ADMIN
    Route::get('/getLogins', 'App\Http\Controllers\api\AdminController@getLogins');
    Route::get('/getHistories', 'App\Http\Controllers\api\AdminController@getHistories');
    Route::get('/getActualAndPlannedBudget', 'App\Http\Controllers\api\AdminController@getActualAndPlannedBudget');
    Route::get('/gettingGADAgendas', 'App\Http\Controllers\api\AdminController@gettingGADAgendas');
    Route::get('/getAgendaAnnexB/{id}', 'App\Http\Controllers\api\AdminController@getAgendaAnnexB'); 
    Route::get('/getActivities', 'App\Http\Controllers\api\AdminController@getActivities'); 
    Route::get('/getPPADetails/{id}', 'App\Http\Controllers\api\AdminController@getPPADetails'); 
    Route::get('/getReports', 'App\Http\Controllers\api\AdminController@getReports'); 
    Route::get('/getImages', 'App\Http\Controllers\api\AdminController@getImages'); 
    Route::get('/getUsers', 'App\Http\Controllers\api\AdminController@getUsers'); 
    Route::get('/getSingleUser/{id}', 'App\Http\Controllers\api\AdminController@getSingleUser');
    Route::get('/getEmployees', 'App\Http\Controllers\api\AdminController@getEmployees'); 
    Route::get('/getSingleEmployee/{id}', 'App\Http\Controllers\api\AdminController@getSingleEmployee'); 
    Route::get('/getEmployeeWithoutAccnt', 'App\Http\Controllers\api\AdminController@getEmployeeWithoutAccnt'); 
    Route::get('/getActualAndPlannedBeneficiaries', 'App\Http\Controllers\api\AdminController@getActualAndPlannedBeneficiaries'); 
    
    Route::post('/getGADAgenda', 'App\Http\Controllers\api\AdminController@getGADAgenda');
    Route::post('/updateAnnexA', 'App\Http\Controllers\api\AdminController@updateAnnexA');
    Route::post('/getAnnexBDetails', 'App\Http\Controllers\api\AdminController@getAnnexBDetails');
    Route::post('/updateAnnexB', 'App\Http\Controllers\api\AdminController@updateAnnexB');
    Route::post('/getPPAperYear', 'App\Http\Controllers\api\AdminController@getPPAperYear');
    Route::post('/updatePPADetails', 'App\Http\Controllers\api\AdminController@updatePPADetails');
    Route::post('/newUser', 'App\Http\Controllers\api\AdminController@newUser');
    Route::post('/updateUser', 'App\Http\Controllers\api\AdminController@updateUser');
    Route::post('/newEmployee', 'App\Http\Controllers\api\AdminController@newEmployee');
    Route::post('/updateEmployee', 'App\Http\Controllers\api\AdminController@updateEmployee');
    Route::post('/resetUserPassword', 'App\Http\Controllers\api\AdminController@resetUserPassword');

    Route::delete('/deleteImage/{id}', 'App\Http\Controllers\api\AdminController@deleteImage');
    Route::delete('/deleteUser/{id}', 'App\Http\Controllers\api\AdminController@deleteUser');
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
