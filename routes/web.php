<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\OtherController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReturController;
use App\Http\Controllers\ReturOtherController;
use App\Http\Controllers\SPTController;
use App\Http\Controllers\SPTIndukController;
use App\Http\Controllers\SPTUniController;
use App\Http\Controllers\SPT2126Controller;
use App\Http\Controllers\SptBadanController;
use App\Http\Controllers\SptBadanL1AController;
use App\Http\Controllers\SptBadanL1BController;
use App\Http\Controllers\SptBadanL2AController;
use App\Http\Controllers\SptBadanL2BController;
use App\Http\Controllers\SptBadanL3AController;
use App\Http\Controllers\SptBadanL3BController;
use App\Http\Controllers\SptBadanL4AController;
use App\Http\Controllers\SptBadanL4BController;
use App\Http\Controllers\SptBadanL5AController;
use App\Http\Controllers\SptBadanL5BController;
use App\Http\Controllers\SptBadanL6Controller;
use App\Http\Controllers\SptBadanL7Controller;
use App\Http\Controllers\SptBadanL8Controller;
use App\Http\Controllers\SptBadanL9Controller;
use App\Http\Controllers\SptBadanL10AController;
use App\Http\Controllers\SptBadanL10BController;
use App\Http\Controllers\SptBadanL10CController;
use App\Http\Controllers\SptBadanL10DController;
use App\Http\Controllers\SptBadanL11A1Controller;
use App\Http\Controllers\SptBadanL11A2Controller;
use App\Http\Controllers\SptBadanL11A3Controller;
use App\Http\Controllers\SptBadanL11A4AController;
use App\Http\Controllers\SptBadanL11A5Controller;
use App\Http\Controllers\SptBadanL11A4BController;
use App\Http\Controllers\SptBadanL11B1Controller;
use App\Http\Controllers\SptBadanL11B2AController;
use App\Http\Controllers\SptBadanL11B2BController;
use App\Http\Controllers\SptBadanL11B3Controller;
use App\Http\Controllers\SptBadanL11CController;
use App\Http\Controllers\SptBadanL12AController;
use App\Http\Controllers\SptBadanL12B3Controller;
use App\Http\Controllers\SptBadanL12B12Controller;
use App\Http\Controllers\SptBadanL12B4Controller;
use App\Http\Controllers\SptBadanL12B4BController;
use App\Http\Controllers\SptBadanL12B5Controller;
use App\Http\Controllers\SptBadanL12B6Controller;
use App\Http\Controllers\SptBadanL12B7Controller;
use App\Http\Controllers\SptBadanL12B8Controller;
use App\Http\Controllers\SptBadanL13AController;
use App\Http\Controllers\SptBadanL13BAController;
use App\Http\Controllers\SptBadanL13BBController;
use App\Http\Controllers\SptBadanL13BCController;
use App\Http\Controllers\SptBadanL13BDController;
use App\Http\Controllers\SptBadanL13CController;
use App\Http\Controllers\SptBadanL14Controller;
use App\Http\Controllers\SptOpController;
use App\Http\Controllers\SptOpL1A1Controller;
use App\Http\Controllers\SptOpL1A2Controller;
use App\Http\Controllers\SptOpL1A3Controller;
use App\Http\Controllers\SptOpL1A4Controller;
use App\Http\Controllers\SptOpL1A5Controller;
use App\Http\Controllers\SptOpL1A6Controller;
use App\Http\Controllers\SptOpL1BController;
use App\Http\Controllers\SptOpL1CController;
use App\Http\Controllers\SptOpL1DController;
use App\Http\Controllers\SptOpL1EController;
use App\Http\Controllers\SptOpL2AController;
use App\Http\Controllers\SptOpL2BController;
use App\Http\Controllers\SptOpL2CController;
use App\Http\Controllers\SptOpL3A13A1Controller;
use App\Http\Controllers\SptOpL3A13A2Controller;
use App\Http\Controllers\SptOpL3A4AController;
use App\Http\Controllers\SptOpL3A4BController;
use App\Http\Controllers\SptOpL3BController;
use App\Http\Controllers\SptOpL3CController;
use App\Http\Controllers\SptOpL3DAController;
use App\Http\Controllers\SptOpL3DBController;
use App\Http\Controllers\SptOpL3DCController;
use App\Http\Controllers\SptOpL4AController;
use App\Http\Controllers\SptOpL5AController;
use App\Http\Controllers\SptOpL5BCController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminCourseListController;
use App\Http\Controllers\AdminTestListController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\BP21Controller;
use App\Http\Controllers\BP26Controller;
use App\Http\Controllers\BPA1Controller;
use App\Http\Controllers\BPA2Controller;
use App\Http\Controllers\BPNRController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BPPUController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseScheduleController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\CourseTestController;
use App\Http\Controllers\CourseModuleController;
use App\Http\Controllers\CourseResultController;
use App\Http\Controllers\CourseUserController;
use App\Http\Controllers\CourseTestUserController;
use App\Http\Controllers\TestUserController;
use App\Http\Controllers\BusinessEntityController;
use App\Http\Controllers\ImpersonationController;
use App\Http\Controllers\CYController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MPController;
use App\Http\Controllers\NIKRegistrationController;
use App\Http\Controllers\SPController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherParticipantController;
use App\Http\Controllers\QuestionBankController;
use App\Http\Controllers\QuestionBankQuestionController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\TestResultController;
use App\Http\Middleware\CheckAccessRights;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureTeacher;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        if (Auth::user() && Auth::user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('dashboard');
    }
    return Inertia::render('Auth/Login');
});

// Registration Portal Routes
Route::get('/registration-portal', function () {
    return Inertia::render('Auth/RegistrationPortal');
})->name('registration-portal');

Route::get('/registration-portal/individual-registration', function () {
    return Inertia::render('Auth/Perseorangan/Perseorangan');
})->name('individual-registration');

Route::get('/registration-portal/individual-registration/nik-registration-selector', function () {
    return Inertia::render('Auth/Perseorangan/NIKRegistrationSelector');
})->name('nik-registration-selector');

Route::get('/registration-portal/nik-registration', [NIKRegistrationController::class, 'index'])->name('nik-registration');
Route::get('/registration-portal/check-nik', [NIKRegistrationController::class, 'checkNik'])->name('taxpayer-identity.check-nik');

Route::post('/taxpayer/register', [NIKRegistrationController::class, 'register'])->name('taxpayer.register');
Route::post('/registration-portal/taxpayer-final-submit', [NIKRegistrationController::class, 'finalSubmit'])->name('taxpayer.final-submit');

Route::get('/registration-confirmation-portal/{taxpayerId}', [NIKRegistrationController::class, 'confirmationPage'])->name('registration.confirmation');
Route::get('/npwp-pdf/{taxpayerId}', [NIKRegistrationController::class, 'generateNPWPPDF'])->name('npwp.pdf');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/courses', [CourseUserController::class, 'index'])->name('courses');
    Route::post('/courses/join', [CourseUserController::class, 'join'])->name('courses.join');
    Route::get('/courses/{id}', [CourseUserController::class, 'detail'])->name('courses.detail');
    Route::post('/courses/{id}/start', [CourseUserController::class, 'startWorking'])->name('courses.start');
    Route::post('/courses/stop', [CourseUserController::class, 'stopWorking'])->name('courses.stop');
    Route::delete('/courses/{id}/leave', [CourseUserController::class, 'destroy'])->name('courses.leave');
    Route::get('/courses/{courseId}/modules', [CourseUserController::class, 'courseModules'])->name('course.showModules');
    Route::get('/courses/{course}/tests/{courseTest}', [CourseUserController::class, 'courseTestDetail'])->name('courses.courseTests.detail');
    Route::post('/courses/{course}/tests/{courseTest}/start', [CourseTestUserController::class, 'start'])->name('courses.courseTests.start');
    Route::get('/courses/{course}/tests/{courseTest}/exam/{question?}', [CourseTestUserController::class, 'exam'])->name('courses.courseTests.exam');
    Route::post('/courses/{course}/tests/{courseTest}/answers/bulk', [CourseTestUserController::class, 'saveAnswersBulk'])->name('courses.courseTests.answers.bulk');
    Route::post('/courses/{course}/tests/{courseTest}/submit', [CourseTestUserController::class, 'submitAttempt'])->name('courses.courseTests.submit');
    Route::post('/courses/{course}/tests/{courseTest}/discard', [CourseTestUserController::class, 'discardAttempt'])->name('courses.courseTests.discard');
    Route::get('/courses/{course}/tests/{courseTest}/result/{attempt}', [CourseTestUserController::class, 'result'])->name('courses.courseTests.result');

    Route::prefix('business-entities')->group(function () {
        Route::get('/', [BusinessEntityController::class, 'index'])->name('business-entities.index');
        Route::get('/create', [BusinessEntityController::class, 'create'])->name('business-entities.create');
        Route::post('/', [BusinessEntityController::class, 'store'])->name('business-entities.store');
        Route::get('/{id}/edit', [BusinessEntityController::class, 'edit'])->name('business-entities.edit');
        Route::put('/{id}', [BusinessEntityController::class, 'update'])->name('business-entities.update');
        Route::delete('/{id}', [BusinessEntityController::class, 'destroy'])->name('business-entities.destroy');
    });

    // Bank Routes (CRUD pages)
    Route::prefix('banks')->group(function () {
        Route::get('/', [BankController::class, 'index'])->name('banks');
        Route::get('/create', [BankController::class, 'create'])->name('banks.create');
        Route::post('/', [BankController::class, 'store'])->name('banks.store');
        Route::get('/{id}/edit', [BankController::class, 'edit'])->name('banks.edit');
        Route::put('/{id}', [BankController::class, 'update'])->name('banks.update');
        Route::delete('/{id}', [BankController::class, 'destroy'])->name('banks.destroy');
    });
    // Bank API Route (for SPT OP popup)
    Route::get('/api/banks', [BankController::class, 'apiIndex'])->name('banks.api.index');

    Route::post('/impersonate/personal', [ImpersonationController::class, 'actAsPersonal'])->name('impersonate.personal');
    Route::post('/impersonate/business/{id}', [ImpersonationController::class, 'actAsBusiness'])->name('impersonate.business');

    Route::get('/tests', [TestUserController::class, 'index'])->name('tests.index');
    Route::post('/tests/join', [TestUserController::class, 'join'])->name('tests.join');
    Route::get('/tests/{id}', [TestUserController::class, 'detail'])->name('tests.detail');
    Route::get('/tests/{id}/exam/{question?}', [TestUserController::class, 'exam'])->name('tests.exam');
    Route::post('/tests/{id}/start', [TestUserController::class, 'startWorking'])->name('tests.start');
    Route::post('/tests/stop', [TestUserController::class, 'stopWorking'])->name('tests.stop');
    Route::post('/tests/{id}/answer', [TestUserController::class, 'saveAnswer'])->name('tests.answer');
    Route::post('/tests/{id}/answers/bulk', [TestUserController::class, 'saveAnswersBulk'])->name('tests.answers.bulk');
    Route::post('/tests/{id}/submit', [TestUserController::class, 'submitAttempt'])->name('tests.submit');
    Route::get('/tests/{id}/result/{attempt}', [TestUserController::class, 'result'])->name('tests.result');
    Route::post('/tests/{id}/discard', [TestUserController::class, 'discardAttempt'])->name('tests.discard');

    Route::get('/modules/{module}/download', [CourseModuleController::class, 'download'])->name('course.module.download');
    Route::get('/modules/{module}/view', [CourseModuleController::class, 'view'])->name('course.module.view');

    Route::get('/invoice/downloadPDF/{id}', [InvoiceController::class, 'downloadPDF'])->name('invoice.downloadPDF');
    Route::get('/bppu/downloadPDF/{id}', [BPPUController::class, 'downloadPDF'])->name('bppu.downloadPDF');
    Route::get('/bpnr/downloadPDF/{id}', [BPNRController::class, 'downloadPDF'])->name('bpnr.downloadPDF');
    Route::get('/sp/downloadPDF/{id}', [SPController::class, 'downloadPDF'])->name('sp.downloadPDF');
    Route::get('/cy/downloadPDF/{id}', [CYController::class, 'downloadPDF'])->name('cy.downloadPDF');
    Route::get('/bp21/downloadPDF/{id}', [BP21Controller::class, 'downloadPDF'])->name('bp21.downloadPDF');
    Route::get('/bp26/downloadPDF/{id}', [BP26Controller::class, 'downloadPDF'])->name('bp26.downloadPDF');
    Route::get('/bpa1/downloadPDF/{id}', [BPA1Controller::class, 'downloadPDF'])->name('bpa1.downloadPDF');
    Route::get('/bpa2/downloadPDF/{id}', [BPA2Controller::class, 'downloadPDF'])->name('bpa2.downloadPDF');
    Route::get('/mp/downloadPDF/{id}', [MPController::class, 'downloadPDF'])->name('mp.downloadPDF');

    Route::get('/spt/downloadPDF/{id}', [SPTController::class, 'downloadPDF'])->name('spt.downloadPDF');
    Route::get('/spt/downloadPDFUnifikasi/{id}', [SPTController::class, 'downloadPDFUnifikasi'])->name('spt.downloadPDFUnifikasi');
    Route::get('/spt/downloadPDF21/{id}', [SPTController::class, 'downloadPDF21'])->name('spt.downloadPDF21');
    Route::get('/spt/downloadBPE/{id}', [SPTController::class, 'downloadBPE'])->name('spt.downloadBPE');
    Route::get('/spt/downloadBPEUnifikasi/{id}', [SPTController::class, 'downloadBPEUnifikasi'])->name('spt.downloadBPEUnifikasi');
    Route::get('/spt/downloadBPE21/{id}', [SPTController::class, 'downloadBPE21'])->name('spt.downloadBPE21');
});

Route::middleware(['auth', 'verified', CheckAccessRights::class . ':efaktur'])->group(function () {
    Route::prefix('invoice')->group(function () {
        Route::get('/', [InvoiceController::class, 'index'])->name('invoice.index');
        Route::get('/output', [InvoiceController::class, 'output'])->name('invoice.output');
        Route::get('/input', [InvoiceController::class, 'input'])->name('invoice.input');
        Route::get('/output/create', [InvoiceController::class, 'create'])->name('invoice.create');
        Route::post('/output/store', [InvoiceController::class, 'store'])->name('invoice.store');
        Route::get('/output/{id}/edit', [InvoiceController::class, 'edit'])->name('invoice.edit');
        Route::put('/output/{id}', [InvoiceController::class, 'update'])->name('invoice.update');
        Route::put('/output/{id}/update-status', [InvoiceController::class, 'updateStatus'])->name('invoice.updateStatus');
        Route::patch('/output/update-status-multiple', [InvoiceController::class, 'updateStatusMultiple'])->name('invoice.updateStatusMultiple');
        Route::patch('/output/update-status-input-multiple', [InvoiceController::class, 'updateStatusInputMultiple'])->name('invoice.updateStatusInputMultiple');
        Route::get('/input/create', [InvoiceController::class, 'createInput'])->name('invoice.createInput');
        Route::get('/input/{id}/edit', [InvoiceController::class, 'editInput'])->name('invoice.editInput');

        Route::get('/output-return', [ReturController::class, 'output'])->name('retur.output');
        Route::get('/input-return', [ReturController::class, 'input'])->name('retur.input');
        Route::get('/output-return/create', [ReturController::class, 'create'])->name('retur.create');
        Route::post('/output-return/store', [ReturController::class, 'store'])->name('retur.store');
        Route::get('/output-return/{id}/edit', [ReturController::class, 'edit'])->name('retur.edit');
        Route::put('/output-return/{id}', [ReturController::class, 'update'])->name('retur.update');
        Route::put('/output-return/{id}/update-status', [ReturController::class, 'updateStatus'])->name('retur.updateStatus');
        Route::patch('/output-return/update-status-multiple', [ReturController::class, 'updateStatusMultiple'])->name('retur.updateStatusMultiple');
        Route::get('/input-return/create', [ReturController::class, 'createInput'])->name('retur.createInput');
        Route::get('/input-return/{id}/edit', [ReturController::class, 'editInput'])->name('retur.editInput');

        Route::get('/other-export', [OtherController::class, 'export'])->name('other.export');
        Route::get('/other-import', [OtherController::class, 'import'])->name('other.import');
        Route::get('/other-export/create', [OtherController::class, 'create'])->name('other.create');
        Route::post('/other-export/store', [OtherController::class, 'store'])->name('other.store');
        Route::get('/other-export/{id}/edit', [OtherController::class, 'edit'])->name('other.edit');
        Route::put('/other-export/{id}', [OtherController::class, 'update'])->name('other.update');
        Route::put('/other-export/{id}/update-status', [OtherController::class, 'updateStatus'])->name('other.updateStatus');
        Route::patch('/other-export/update-status-multiple', [OtherController::class, 'updateStatusMultiple'])->name('other.updateStatusMultiple');
        Route::get('/other-import/create', [OtherController::class, 'createImport'])->name('other.createImport');
        Route::get('/other-import/{id}/edit', [OtherController::class, 'editImport'])->name('other.editImport');

        Route::get('/export-return', [ReturOtherController::class, 'export'])->name('retur.export');
        Route::get('/import-return', [ReturOtherController::class, 'import'])->name('retur.import');
        Route::get('/export-return/create', [ReturOtherController::class, 'createExport'])->name('retur.createExport');
        Route::post('/export-return/store', [ReturOtherController::class, 'store'])->name('retur.storeOther');
        Route::get('/export-return/{id}/edit', [ReturOtherController::class, 'editExport'])->name('retur.editExport');
        Route::put('/export-return/{id}', [ReturOtherController::class, 'update'])->name('retur.updateOther');
        Route::put('/export-return/{id}/update-status', [ReturOtherController::class, 'updateStatus'])->name('retur.updateStatusOther');
        Route::patch('/export-return/update-status-multiple', [ReturOtherController::class, 'updateStatusMultiple'])->name('retur.updateStatusMultipleOther');
        Route::get('/import-return/create', [ReturOtherController::class, 'createImport'])->name('retur.createImport');
        Route::get('/import-return/{id}/edit', [ReturOtherController::class, 'editImport'])->name('retur.editImport');
    });
});

Route::middleware(['auth', 'verified', CheckAccessRights::class . ':ebupot'])->group(function () {
    Route::prefix('bppu')->group(function () {
        Route::get('/', [BPPUController::class, 'index'])->name('bppu.notIssued');
        Route::get('/not-issued', [BPPUController::class, 'index'])->name('bppu.notIssued');
        Route::get('/issued', [BPPUController::class, 'issued'])->name('bppu.issued');
        Route::get('/invalid', [BPPUController::class, 'invalid'])->name('bppu.invalid');
        Route::get('/not-issued/{id}/detail', [BPPUController::class, 'show'])->name('bppu.show');
        Route::get('/not-issued/create', [BPPUController::class, 'create'])->name('bppu.create');
        Route::post('/not-issued/store', [BPPUController::class, 'store'])->name('bppu.store');
        Route::get('/not-issued/{id}/edit', [BPPUController::class, 'edit'])->name('bppu.edit');
        Route::put('/not-issued/{id}', [BPPUController::class, 'update'])->name('bppu.update');
        Route::patch('/not-issued/update-status-multiple', [BPPUController::class, 'updateStatusMultiple'])->name('bppu.updateStatusMultiple');
        Route::delete('/not-issued/delete-multiple', [BPPUController::class, 'deleteMultiple'])->name('bppu.deleteMultiple');
    });

    Route::prefix('bpnr')->group(function () {
        Route::get('/', [BPNRController::class, 'index'])->name('bpnr.notIssued');
        Route::get('/not-issued', [BPNRController::class, 'index'])->name('bpnr.notIssued');
        Route::get('/issued', [BPNRController::class, 'issued'])->name('bpnr.issued');
        Route::get('/invalid', [BPNRController::class, 'invalid'])->name('bpnr.invalid');
        Route::get('/not-issued/{id}/detail', [BPNRController::class, 'show'])->name('bpnr.show');
        Route::get('/not-issued/create', [BPNRController::class, 'create'])->name('bpnr.create');
        Route::post('/not-issued/store', [BPNRController::class, 'store'])->name('bpnr.store');
        Route::get('/not-issued/{id}/edit', [BPNRController::class, 'edit'])->name('bpnr.edit');
        Route::put('/not-issued/{id}', [BPNRController::class, 'update'])->name('bpnr.update');
        Route::patch('/not-issued/update-status-multiple', [BPNRController::class, 'updateStatusMultiple'])->name('bpnr.updateStatusMultiple');
        Route::delete('/not-issued/delete-multiple', [BPNRController::class, 'deleteMultiple'])->name('bpnr.deleteMultiple');
    });

    Route::prefix('sp')->group(function () {
        Route::get('/', [SPController::class, 'index'])->name('sp.notIssued');
        Route::get('/not-issued', [SPController::class, 'index'])->name('sp.notIssued');
        Route::get('/issued', [SPController::class, 'issued'])->name('sp.issued');
        Route::get('/invalid', [SPController::class, 'invalid'])->name('sp.invalid');
        Route::get('/not-issued/{id}/detail', [SPController::class, 'show'])->name('sp.show');
        Route::get('/not-issued/create', [SPController::class, 'create'])->name('sp.create');
        Route::post('/not-issued/store', [SPController::class, 'store'])->name('sp.store');
        Route::get('/not-issued/{id}/edit', [SPController::class, 'edit'])->name('sp.edit');
        Route::put('/not-issued/{id}', [SPController::class, 'update'])->name('sp.update');
        Route::patch('/not-issued/update-status-multiple', [SPController::class, 'updateStatusMultiple'])->name('sp.updateStatusMultiple');
        Route::delete('/not-issued/delete-multiple', [SPController::class, 'deleteMultiple'])->name('sp.deleteMultiple');
    });

    Route::prefix('cy')->group(function () {
        Route::get('/', [CYController::class, 'index'])->name('cy.notIssued');
        Route::get('/not-issued', [CYController::class, 'index'])->name('cy.notIssued');
        Route::get('/issued', [CYController::class, 'issued'])->name('cy.issued');
        Route::get('/invalid', [CYController::class, 'invalid'])->name('cy.invalid');
        Route::get('/not-issued/{id}/detail', [CYController::class, 'show'])->name('cy.show');
        Route::get('/not-issued/create', [CYController::class, 'create'])->name('cy.create');
        Route::post('/not-issued/store', [CYController::class, 'store'])->name('cy.store');
        Route::get('/not-issued/{id}/edit', [CYController::class, 'edit'])->name('cy.edit');
        Route::put('/not-issued/{id}', [CYController::class, 'update'])->name('cy.update');
        Route::patch('/not-issued/update-status-multiple', [CYController::class, 'updateStatusMultiple'])->name('cy.updateStatusMultiple');
        Route::delete('/not-issued/delete-multiple', [CYController::class, 'deleteMultiple'])->name('cy.deleteMultiple');
    });

    Route::prefix('bp21')->group(function () {
        Route::get('/', [BP21Controller::class, 'index'])->name('bp21.notIssued');
        Route::get('/not-issued', [BP21Controller::class, 'index'])->name('bp21.notIssued');
        Route::get('/issued', [BP21Controller::class, 'issued'])->name('bp21.issued');
        Route::get('/invalid', [BP21Controller::class, 'invalid'])->name('bp21.invalid');
        Route::get('/not-issued/{id}/detail', [BP21Controller::class, 'show'])->name('bp21.show');
        Route::get('/not-issued/create', [BP21Controller::class, 'create'])->name('bp21.create');
        Route::post('/not-issued/store', [BP21Controller::class, 'store'])->name('bp21.store');
        Route::get('/not-issued/{id}/edit', [BP21Controller::class, 'edit'])->name('bp21.edit');
        Route::put('/not-issued/{id}', [BP21Controller::class, 'update'])->name('bp21.update');
        Route::patch('/not-issued/update-status-multiple', [BP21Controller::class, 'updateStatusMultiple'])->name('bp21.updateStatusMultiple');
        Route::delete('/not-issued/delete-multiple', [BP21Controller::class, 'deleteMultiple'])->name('bp21.deleteMultiple');
    });

    Route::prefix('bp26')->group(function () {
        Route::get('/', [BP26Controller::class, 'index'])->name('bp26.notIssued');
        Route::get('/not-issued', [BP26Controller::class, 'index'])->name('bp26.notIssued');
        Route::get('/issued', [BP26Controller::class, 'issued'])->name('bp26.issued');
        Route::get('/invalid', [BP26Controller::class, 'invalid'])->name('bp26.invalid');
        Route::get('/not-issued/{id}/detail', [BP26Controller::class, 'show'])->name('bp26.show');
        Route::get('/not-issued/create', [BP26Controller::class, 'create'])->name('bp26.create');
        Route::post('/not-issued/store', [BP26Controller::class, 'store'])->name('bp26.store');
        Route::get('/not-issued/{id}/edit', [BP26Controller::class, 'edit'])->name('bp26.edit');
        Route::put('/not-issued/{id}', [BP26Controller::class, 'update'])->name('bp26.update');
        Route::patch('/not-issued/update-status-multiple', [BP26Controller::class, 'updateStatusMultiple'])->name('bp26.updateStatusMultiple');
        Route::delete('/not-issued/delete-multiple', [BP26Controller::class, 'deleteMultiple'])->name('bp26.deleteMultiple');
    });

    Route::prefix('bpa1')->group(function () {
        Route::get('/', [BPA1Controller::class, 'index'])->name('bpa1.notIssued');
        Route::get('/not-issued', [BPA1Controller::class, 'index'])->name('bpa1.notIssued');
        Route::get('/issued', [BPA1Controller::class, 'issued'])->name('bpa1.issued');
        Route::get('/invalid', [BPA1Controller::class, 'invalid'])->name('bpa1.invalid');
        Route::get('/{id}/detail', [BPA1Controller::class, 'show'])->name('bpa1.show');
        Route::get('/not-issued/create', [BPA1Controller::class, 'create'])->name('bpa1.create');
        Route::post('/not-issued/store', [BPA1Controller::class, 'store'])->name('bpa1.store');
        Route::get('/{id}/edit', [BPA1Controller::class, 'edit'])->name('bpa1.edit');
        Route::put('/{id}', [BPA1Controller::class, 'update'])->name('bpa1.update');
        Route::patch('/update-status-multiple', [BPA1Controller::class, 'updateStatusMultiple'])->name('bpa1.updateStatusMultiple');
        Route::delete('/delete-multiple', [BPA1Controller::class, 'deleteMultiple'])->name('bpa1.deleteMultiple');
    });

    Route::prefix('bpa2')->group(function () {
        Route::get('/', [BPA2Controller::class, 'index'])->name('bpa2.notIssued');
        Route::get('/not-issued', [BPA2Controller::class, 'index'])->name('bpa2.notIssued');
        Route::get('/issued', [BPA2Controller::class, 'issued'])->name('bpa2.issued');
        Route::get('/invalid', [BPA2Controller::class, 'invalid'])->name('bpa2.invalid');
        Route::get('/{id}/detail', [BPA2Controller::class, 'show'])->name('bpa2.show');
        Route::get('/not-issued/create', [BPA2Controller::class, 'create'])->name('bpa2.create');
        Route::post('/not-issued/store', [BPA2Controller::class, 'store'])->name('bpa2.store');
        Route::get('/{id}/edit', [BPA2Controller::class, 'edit'])->name('bpa2.edit');
        Route::put('/{id}', [BPA2Controller::class, 'update'])->name('bpa2.update');
        Route::patch('/update-status-multiple', [BPA2Controller::class, 'updateStatusMultiple'])->name('bpa2.updateStatusMultiple');
        Route::delete('/delete-multiple', [BPA2Controller::class, 'deleteMultiple'])->name('bpa2.deleteMultiple');
    });

    Route::prefix('mp')->group(function () {
        Route::get('/', [MPController::class, 'index'])->name('mp.notIssued');
        Route::get('/not-issued', [MPController::class, 'index'])->name('mp.notIssued');
        Route::get('/issued', [MPController::class, 'issued'])->name('mp.issued');
        Route::get('/invalid', [MPController::class, 'invalid'])->name('mp.invalid');
        Route::get('/not-issued/{id}/detail', [MPController::class, 'show'])->name('mp.show');
        Route::get('/not-issued/create', [MPController::class, 'create'])->name('mp.create');
        Route::post('/not-issued/store', [MPController::class, 'store'])->name('mp.store');
        Route::get('/not-issued/{id}/edit', [MPController::class, 'edit'])->name('mp.edit');
        Route::put('/not-issued/{id}', [MPController::class, 'update'])->name('mp.update');
        Route::patch('/not-issued/update-status-multiple', [MPController::class, 'updateStatusMultiple'])->name('mp.updateStatusMultiple');
        Route::delete('/not-issued/delete-multiple', [MPController::class, 'deleteMultiple'])->name('mp.deleteMultiple');
    });
});

Route::middleware(['auth', 'verified', CheckAccessRights::class . ':efaktur,ebupot'])->group(function () {
    Route::prefix('spt')->group(function () {
        Route::get('/', [SPTController::class, 'index'])->name('spt');
        Route::get('/konsep', [SPTController::class, 'index'])->name('spt.konsep');
        Route::get('/waiting', [SPTController::class, 'waiting'])->name('spt.waiting');
        Route::get('/submitted', [SPTController::class, 'submitted'])->name('spt.submitted');
        Route::get('/rejected', [SPTController::class, 'rejected'])->name('spt.rejected');
        Route::get('/canceled', [SPTController::class, 'canceled'])->name('spt.canceled');

        Route::get('/konsep/create', [SPTController::class, 'create'])->name('spt.create');
        Route::post('/konsep/store', [SPTController::class, 'store'])->name('spt.store');
        Route::get('/konsep/{id}/detail', [SPTController::class, 'show'])->name('spt.show');
        Route::put('/konsep/{id}/updateStatus', [SPTController::class, 'updateStatus'])->name('spt.updateStatus');
        Route::post('/konsep/storeInduk', [SPTIndukController::class, 'storeInduk'])->name('spt.storeInduk');

        Route::get('/konsep/{id}/detail-uni', [SPTController::class, 'detailUni'])->name('spt.detailUni');
        Route::post('/konsep/storeUnifikasi', [SPTUniController::class, 'store'])->name('spt.storeUnifikasi');

        Route::get('/konsep/{id}/detail-21', [SPTController::class, 'detail21'])->name('spt.detail21');
        Route::post('/konsep/store21', [SPT2126Controller::class, 'store'])->name('spt.store21');

        // SPT OP Routes
        Route::get('/konsep/{id}/detail-op', [SptOpController::class, 'show'])->name('spt.detailOp');
        Route::post('/konsep/storeOp', [SptOpController::class, 'store'])->name('spt.storeOp');
        Route::post('/konsep/saveOpDraft', [SptOpController::class, 'saveDraft'])->name('spt.saveOpDraft');
        Route::post('/konsep/op/upload-attachment', [SptOpController::class, 'uploadAttachment'])->name('spt.op.upload-attachment');
        Route::get('/spt/downloadBPEOp/{id}', [SptOpController::class, 'downloadBPEOp'])->name('spt.downloadBPEOp');
        Route::get('/spt/downloadSPTOp/{id}', [SptOpController::class, 'downloadSPTOp'])->name('spt.downloadSPTOp');

        // SPT Badan Routes
        Route::get('/konsep/{id}/detail-badan', [SptBadanController::class, 'show'])->name('spt.detailBadan');
        Route::post('/konsep/storeBadan', [SptBadanController::class, 'store'])->name('spt.storeBadan');
        Route::post('/konsep/saveBadanDraft', [SptBadanController::class, 'saveDraft'])->name('spt.saveBadanDraft');
        Route::post('/konsep/badan/upload-attachment', [SptBadanController::class, 'uploadAttachment'])->name('spt.badan.upload-attachment');
        Route::delete('/konsep/badan/delete-attachment', [SptBadanController::class, 'deleteAttachment'])->name('spt.badan.delete-attachment');
        Route::get('/spt/downloadBPEBadan/{id}', [SptBadanController::class, 'downloadBPEBadan'])->name('spt.downloadBPEBadan');
        Route::get('/spt/downloadSPTBadan/{id}', [SptBadanController::class, 'downloadSPTBadan'])->name('spt.downloadSPTBadan');

        // SPT Badan Lampiran L1A (Rekonsiliasi Laporan Keuangan)
        Route::post('/konsep/badan/l1a1/sync', [SptBadanL1AController::class, 'syncL1A1'])->name('spt.badan.l1a1.sync');
        Route::post('/konsep/badan/l1b1/sync', [SptBadanL1AController::class, 'syncL1B1'])->name('spt.badan.l1b1.sync');
        Route::post('/konsep/badan/l1b/sync', [SptBadanL1BController::class, 'sync'])->name('spt.badan.l1b.sync');
        Route::post('/konsep/badan/l1b2/sync', [SptBadanL1BController::class, 'syncL1B2'])->name('spt.badan.l1b2.sync');
        Route::post('/konsep/badan/l1c1/sync', [SptBadanL1AController::class, 'syncL1C1'])->name('spt.badan.l1c1.sync');
        Route::post('/konsep/badan/l1c2/sync', [SptBadanL1BController::class, 'syncL1C2'])->name('spt.badan.l1c2.sync');
        Route::post('/konsep/badan/l1d1/sync', [SptBadanL1AController::class, 'syncL1D1'])->name('spt.badan.l1d1.sync');
        Route::post('/konsep/badan/l1d2/sync', [SptBadanL1BController::class, 'syncL1D2'])->name('spt.badan.l1d2.sync');
        Route::post('/konsep/badan/l1e1/sync', [SptBadanL1AController::class, 'syncL1E1'])->name('spt.badan.l1e1.sync');
        Route::post('/konsep/badan/l1e2/sync', [SptBadanL1BController::class, 'syncL1E2'])->name('spt.badan.l1e2.sync');
        Route::post('/konsep/badan/l1f1/sync', [SptBadanL1AController::class, 'syncL1F1'])->name('spt.badan.l1f1.sync');
        Route::post('/konsep/badan/l1f2/sync', [SptBadanL1BController::class, 'syncL1F2'])->name('spt.badan.l1f2.sync');
        Route::post('/konsep/badan/l1g1/sync', [SptBadanL1AController::class, 'syncL1G1'])->name('spt.badan.l1g1.sync');
        Route::post('/konsep/badan/l1g2/sync', [SptBadanL1BController::class, 'syncL1G2'])->name('spt.badan.l1g2.sync');
        Route::post('/konsep/badan/l1h1/sync', [SptBadanL1AController::class, 'syncL1H1'])->name('spt.badan.l1h1.sync');
        Route::post('/konsep/badan/l1h2/sync', [SptBadanL1BController::class, 'syncL1H2'])->name('spt.badan.l1h2.sync');
        Route::post('/konsep/badan/l1i1/sync', [SptBadanL1AController::class, 'syncL1I1'])->name('spt.badan.l1i1.sync');
        Route::post('/konsep/badan/l1i2/sync', [SptBadanL1BController::class, 'syncL1I2'])->name('spt.badan.l1i2.sync');
        Route::post('/konsep/badan/l1j1/sync', [SptBadanL1AController::class, 'syncL1J1'])->name('spt.badan.l1j1.sync');
        Route::post('/konsep/badan/l1j2/sync', [SptBadanL1BController::class, 'syncL1J2'])->name('spt.badan.l1j2.sync');
        Route::post('/konsep/badan/l1k1/sync', [SptBadanL1AController::class, 'syncL1K1'])->name('spt.badan.l1k1.sync');
        Route::post('/konsep/badan/l1k2/sync', [SptBadanL1BController::class, 'syncL1K2'])->name('spt.badan.l1k2.sync');
        Route::post('/konsep/badan/l1l1/sync', [SptBadanL1AController::class, 'syncL1L1'])->name('spt.badan.l1l1.sync');
        Route::post('/konsep/badan/l1l2/sync', [SptBadanL1BController::class, 'syncL1L2'])->name('spt.badan.l1l2.sync');

        // SPT Badan Lampiran L2A (Pemegang Saham / Pemilik Modal)
        Route::post('/konsep/badan/l2a', [SptBadanL2AController::class, 'store'])->name('spt.badan.l2a.store');
        Route::put('/konsep/badan/l2a/{id}', [SptBadanL2AController::class, 'update'])->name('spt.badan.l2a.update');
        Route::delete('/konsep/badan/l2a', [SptBadanL2AController::class, 'destroy'])->name('spt.badan.l2a.destroy');

        // SPT Badan Lampiran L2B (Penyertaan Modal / Utang / Piutang pada Perusahaan Afiliasi)
        Route::post('/konsep/badan/l2b', [SptBadanL2BController::class, 'store'])->name('spt.badan.l2b.store');
        Route::put('/konsep/badan/l2b/{id}', [SptBadanL2BController::class, 'update'])->name('spt.badan.l2b.update');
        Route::delete('/konsep/badan/l2b', [SptBadanL2BController::class, 'destroy'])->name('spt.badan.l2b.destroy');

        // SPT Badan Lampiran L3A (Kredit Pajak Luar Negeri)
        Route::post('/konsep/badan/l3a', [SptBadanL3AController::class, 'store'])->name('spt.badan.l3a.store');
        Route::put('/konsep/badan/l3a/{id}', [SptBadanL3AController::class, 'update'])->name('spt.badan.l3a.update');
        Route::delete('/konsep/badan/l3a', [SptBadanL3AController::class, 'destroy'])->name('spt.badan.l3a.destroy');

        // SPT Badan Lampiran L3B (Daftar Pemotongan/Pemungutan PPh oleh Pihak Lain)
        Route::post('/konsep/badan/l3b', [SptBadanL3BController::class, 'store'])->name('spt.badan.l3b.store');
        Route::put('/konsep/badan/l3b/{id}', [SptBadanL3BController::class, 'update'])->name('spt.badan.l3b.update');
        Route::delete('/konsep/badan/l3b', [SptBadanL3BController::class, 'destroy'])->name('spt.badan.l3b.destroy');

        // SPT Badan Lampiran L4A (Daftar Pemotongan/Pemungutan PPh oleh Pihak Ketiga)
        Route::post('/konsep/badan/l4a', [SptBadanL4AController::class, 'store'])->name('spt.badan.l4a.store');
        Route::put('/konsep/badan/l4a/{id}', [SptBadanL4AController::class, 'update'])->name('spt.badan.l4a.update');
        Route::delete('/konsep/badan/l4a', [SptBadanL4AController::class, 'destroy'])->name('spt.badan.l4a.destroy');

        // SPT Badan Lampiran L4B (Penghasilan yang Tidak Termasuk Objek Pajak)
        Route::post('/konsep/badan/l4b', [SptBadanL4BController::class, 'store'])->name('spt.badan.l4b.store');
        Route::put('/konsep/badan/l4b/{id}', [SptBadanL4BController::class, 'update'])->name('spt.badan.l4b.update');
        Route::delete('/konsep/badan/l4b', [SptBadanL4BController::class, 'destroy'])->name('spt.badan.l4b.destroy');

        // SPT Badan Lampiran L5A (Daftar Tempat Kegiatan Usaha)
        Route::post('/konsep/badan/l5a', [SptBadanL5AController::class, 'store'])->name('spt.badan.l5a.store');
        Route::put('/konsep/badan/l5a/{id}', [SptBadanL5AController::class, 'update'])->name('spt.badan.l5a.update');
        Route::delete('/konsep/badan/l5a', [SptBadanL5AController::class, 'destroy'])->name('spt.badan.l5a.destroy');

        // SPT Badan Lampiran L5B (Penghasilan Bruto per Bulan per TKU)
        Route::post('/konsep/badan/l5b', [SptBadanL5BController::class, 'store'])->name('spt.badan.l5b.store');
        Route::put('/konsep/badan/l5b/{id}', [SptBadanL5BController::class, 'update'])->name('spt.badan.l5b.update');
        Route::delete('/konsep/badan/l5b', [SptBadanL5BController::class, 'destroy'])->name('spt.badan.l5b.destroy');

        // SPT Badan Lampiran L6 (Penghitungan Angsuran PPh Pasal 25)
        Route::post('/konsep/badan/l6/sync', [SptBadanL6Controller::class, 'sync'])->name('spt.badan.l6.sync');

        // SPT Badan Lampiran L7
        Route::post('/konsep/badan/l7', [SptBadanL7Controller::class, 'store'])->name('spt.badan.l7.store');
        Route::put('/konsep/badan/l7/{id}', [SptBadanL7Controller::class, 'update'])->name('spt.badan.l7.update');
        Route::delete('/konsep/badan/l7', [SptBadanL7Controller::class, 'destroy'])->name('spt.badan.l7.destroy');

        // SPT Badan Lampiran L8 (Penghitungan PPh Terutang)
        Route::post('/konsep/badan/l8/sync', [SptBadanL8Controller::class, 'sync'])->name('spt.badan.l8.sync');

        // SPT Badan Lampiran L9 (Penyusutan Harta)
        Route::post('/konsep/badan/l9', [SptBadanL9Controller::class, 'store'])->name('spt.badan.l9.store');
        Route::put('/konsep/badan/l9/{id}', [SptBadanL9Controller::class, 'update'])->name('spt.badan.l9.update');
        Route::delete('/konsep/badan/l9', [SptBadanL9Controller::class, 'destroy'])->name('spt.badan.l9.destroy');

        // SPT Badan Lampiran L10A (Transaksi Hubungan Istimewa)
        Route::post('/konsep/badan/l10a', [SptBadanL10AController::class, 'store'])->name('spt.badan.l10a.store');
        Route::put('/konsep/badan/l10a/{id}', [SptBadanL10AController::class, 'update'])->name('spt.badan.l10a.update');
        Route::delete('/konsep/badan/l10a', [SptBadanL10AController::class, 'destroy'])->name('spt.badan.l10a.destroy');

        // SPT Badan Lampiran L10B (Pernyataan Hubungan Istimewa)
        Route::post('/konsep/badan/l10b/sync', [SptBadanL10BController::class, 'sync'])->name('spt.badan.l10b.sync');

        // SPT Badan Lampiran L10C (Daftar Transaksi Hubungan Istimewa per Mitra)
        Route::post('/konsep/badan/l10c', [SptBadanL10CController::class, 'store'])->name('spt.badan.l10c.store');
        Route::put('/konsep/badan/l10c/{id}', [SptBadanL10CController::class, 'update'])->name('spt.badan.l10c.update');
        Route::delete('/konsep/badan/l10c', [SptBadanL10CController::class, 'destroy'])->name('spt.badan.l10c.destroy');

        // SPT Badan Lampiran L10D (Ikhtisar Dokumen Transfer Pricing)
        Route::post('/konsep/badan/l10d/sync', [SptBadanL10DController::class, 'sync'])->name('spt.badan.l10d.sync');

        // SPT Badan Lampiran L11A-1 (Biaya Berkaitan dengan Penghasilan Bruto)
        Route::post('/konsep/badan/l11a1', [SptBadanL11A1Controller::class, 'store'])->name('spt.badan.l11a1.store');
        Route::put('/konsep/badan/l11a1/{id}', [SptBadanL11A1Controller::class, 'update'])->name('spt.badan.l11a1.update');
        Route::delete('/konsep/badan/l11a1', [SptBadanL11A1Controller::class, 'destroy'])->name('spt.badan.l11a1.destroy');

        // SPT Badan Lampiran L11A-2 (Biaya Promosi)
        Route::post('/konsep/badan/l11a2', [SptBadanL11A2Controller::class, 'store'])->name('spt.badan.l11a2.store');
        Route::put('/konsep/badan/l11a2/{id}', [SptBadanL11A2Controller::class, 'update'])->name('spt.badan.l11a2.update');
        Route::delete('/konsep/badan/l11a2', [SptBadanL11A2Controller::class, 'destroy'])->name('spt.badan.l11a2.destroy');

        // SPT Badan Lampiran L11A-3 (Piutang yang Nyata Tidak Dapat Ditagih)
        Route::post('/konsep/badan/l11a3', [SptBadanL11A3Controller::class, 'store'])->name('spt.badan.l11a3.store');
        Route::put('/konsep/badan/l11a3/{id}', [SptBadanL11A3Controller::class, 'update'])->name('spt.badan.l11a3.update');
        Route::delete('/konsep/badan/l11a3', [SptBadanL11A3Controller::class, 'destroy'])->name('spt.badan.l11a3.destroy');

        // SPT Badan Lampiran L11A-4A (Penyusutan Harta Berwujud)
        Route::post('/konsep/badan/l11a4a', [SptBadanL11A4AController::class, 'store'])->name('spt.badan.l11a4a.store');
        Route::put('/konsep/badan/l11a4a/{id}', [SptBadanL11A4AController::class, 'update'])->name('spt.badan.l11a4a.update');
        Route::delete('/konsep/badan/l11a4a', [SptBadanL11A4AController::class, 'destroy'])->name('spt.badan.l11a4a.destroy');

        // SPT Badan Lampiran L11A-5 (Kerugian dari Penanaman Modal)
        Route::post('/konsep/badan/l11a5', [SptBadanL11A5Controller::class, 'store'])->name('spt.badan.l11a5.store');
        Route::put('/konsep/badan/l11a5/{id}', [SptBadanL11A5Controller::class, 'update'])->name('spt.badan.l11a5.update');
        Route::delete('/konsep/badan/l11a5', [SptBadanL11A5Controller::class, 'destroy'])->name('spt.badan.l11a5.destroy');

        // SPT Badan Lampiran L11A-4B (Natura/Kenikmatan Daerah Tertentu)
        Route::post('/konsep/badan/l11a4b/sync', [SptBadanL11A4BController::class, 'sync'])->name('spt.badan.l11a4b.sync');

        // SPT Badan Lampiran L11B-1 (Penghitungan EBITDA)
        Route::post('/konsep/badan/l11b1/sync', [SptBadanL11B1Controller::class, 'sync'])->name('spt.badan.l11b1.sync');

        // SPT Badan Lampiran L11B-2A (Saldo Rata-Rata Utang)
        Route::post('/konsep/badan/l11b2a', [SptBadanL11B2AController::class, 'store'])->name('spt.badan.l11b2a.store');
        Route::put('/konsep/badan/l11b2a/{id}', [SptBadanL11B2AController::class, 'update'])->name('spt.badan.l11b2a.update');
        Route::delete('/konsep/badan/l11b2a', [SptBadanL11B2AController::class, 'destroy'])->name('spt.badan.l11b2a.destroy');

        // SPT Badan Lampiran L11B-2B (Saldo Rata-Rata Modal)
        Route::post('/konsep/badan/l11b2b', [SptBadanL11B2BController::class, 'store'])->name('spt.badan.l11b2b.store');
        Route::put('/konsep/badan/l11b2b/{id}', [SptBadanL11B2BController::class, 'update'])->name('spt.badan.l11b2b.update');
        Route::delete('/konsep/badan/l11b2b', [SptBadanL11B2BController::class, 'destroy'])->name('spt.badan.l11b2b.destroy');

        // SPT Badan Lampiran L11B-3 (Penghitungan Biaya Pinjaman)
        Route::post('/konsep/badan/l11b3', [SptBadanL11B3Controller::class, 'store'])->name('spt.badan.l11b3.store');
        Route::put('/konsep/badan/l11b3/{id}', [SptBadanL11B3Controller::class, 'update'])->name('spt.badan.l11b3.update');
        Route::delete('/konsep/badan/l11b3', [SptBadanL11B3Controller::class, 'destroy'])->name('spt.badan.l11b3.destroy');

        // SPT Badan Lampiran L11C (Daftar Pinjaman)
        Route::post('/konsep/badan/l11c', [SptBadanL11CController::class, 'store'])->name('spt.badan.l11c.store');
        Route::put('/konsep/badan/l11c/{id}', [SptBadanL11CController::class, 'update'])->name('spt.badan.l11c.update');
        Route::delete('/konsep/badan/l11c', [SptBadanL11CController::class, 'destroy'])->name('spt.badan.l11c.destroy');

        // SPT Badan Lampiran L12A (PPh Pasal 26 Ayat 4)
        Route::post('/konsep/badan/l12a/sync', [SptBadanL12AController::class, 'sync'])->name('spt.badan.l12a.sync');

        // SPT Badan Lampiran L12B-1/2 (Identitas Wajib Pajak & Kantor Pusat BUT)
        Route::post('/konsep/badan/l12b12', [SptBadanL12B12Controller::class, 'store'])->name('spt.badan.l12b12.store');
        Route::put('/konsep/badan/l12b12/{id}', [SptBadanL12B12Controller::class, 'update'])->name('spt.badan.l12b12.update');

        // SPT Badan Lampiran L12B-3 (Penghasilan Kena Pajak Sesudah Dikurangi Pajak)
        Route::post('/konsep/badan/l12b3', [SptBadanL12B3Controller::class, 'store'])->name('spt.badan.l12b3.store');
        Route::put('/konsep/badan/l12b3/{id}', [SptBadanL12B3Controller::class, 'update'])->name('spt.badan.l12b3.update');
        Route::delete('/konsep/badan/l12b3', [SptBadanL12B3Controller::class, 'destroy'])->name('spt.badan.l12b3.destroy');

        // SPT Badan Lampiran L12B-4 (Bentuk Penanaman Modal)
        Route::post('/konsep/badan/l12b4/sync', [SptBadanL12B4Controller::class, 'sync'])->name('spt.badan.l12b4.sync');

        // SPT Badan Lampiran L12B-4B (Realisasi Penanaman Kembali)
        Route::post('/konsep/badan/l12b4b', [SptBadanL12B4BController::class, 'store'])->name('spt.badan.l12b4b.store');
        Route::put('/konsep/badan/l12b4b/{id}', [SptBadanL12B4BController::class, 'update'])->name('spt.badan.l12b4b.update');
        Route::delete('/konsep/badan/l12b4b', [SptBadanL12B4BController::class, 'destroyMultiple'])->name('spt.badan.l12b4b.destroyMultiple');

        // SPT Badan Lampiran L12B-5 (Penyertaan Modal - Perusahaan Baru)
        Route::post('/konsep/badan/l12b5', [SptBadanL12B5Controller::class, 'store'])->name('spt.badan.l12b5.store');
        Route::put('/konsep/badan/l12b5/{id}', [SptBadanL12B5Controller::class, 'update'])->name('spt.badan.l12b5.update');
        Route::delete('/konsep/badan/l12b5', [SptBadanL12B5Controller::class, 'destroy'])->name('spt.badan.l12b5.destroy');

        // SPT Badan Lampiran L12B-6 (Penyertaan Modal - Perusahaan Sudah Berdiri)
        Route::post('/konsep/badan/l12b6', [SptBadanL12B6Controller::class, 'store'])->name('spt.badan.l12b6.store');
        Route::put('/konsep/badan/l12b6/{id}', [SptBadanL12B6Controller::class, 'update'])->name('spt.badan.l12b6.update');
        Route::delete('/konsep/badan/l12b6', [SptBadanL12B6Controller::class, 'destroy'])->name('spt.badan.l12b6.destroy');

        // SPT Badan Lampiran L12B-7 (Pembelian Aktiva Tetap)
        Route::post('/konsep/badan/l12b7', [SptBadanL12B7Controller::class, 'store'])->name('spt.badan.l12b7.store');
        Route::put('/konsep/badan/l12b7/{id}', [SptBadanL12B7Controller::class, 'update'])->name('spt.badan.l12b7.update');
        Route::delete('/konsep/badan/l12b7', [SptBadanL12B7Controller::class, 'destroy'])->name('spt.badan.l12b7.destroy');

        // SPT Badan Lampiran L12B-8 (Investasi Aktiva Tidak Berwujud)
        Route::post('/konsep/badan/l12b8', [SptBadanL12B8Controller::class, 'store'])->name('spt.badan.l12b8.store');
        Route::put('/konsep/badan/l12b8/{id}', [SptBadanL12B8Controller::class, 'update'])->name('spt.badan.l12b8.update');
        Route::delete('/konsep/badan/l12b8', [SptBadanL12B8Controller::class, 'destroy'])->name('spt.badan.l12b8.destroy');

        // SPT Badan Lampiran L13A (Fasilitas Pengurangan Penghasilan Neto)
        Route::post('/konsep/badan/l13a', [SptBadanL13AController::class, 'store'])->name('spt.badan.l13a.store');
        Route::put('/konsep/badan/l13a/{id}', [SptBadanL13AController::class, 'update'])->name('spt.badan.l13a.update');
        Route::delete('/konsep/badan/l13a', [SptBadanL13AController::class, 'destroy'])->name('spt.badan.l13a.destroy');

        // SPT Badan Lampiran L13B-A (Perjanjian Kerja Sama Praktik Kerja/Pemagangan/Pembelajaran)
        Route::post('/konsep/badan/l13ba', [SptBadanL13BAController::class, 'store'])->name('spt.badan.l13ba.store');
        Route::put('/konsep/badan/l13ba/{id}', [SptBadanL13BAController::class, 'update'])->name('spt.badan.l13ba.update');
        Route::delete('/konsep/badan/l13ba', [SptBadanL13BAController::class, 'destroy'])->name('spt.badan.l13ba.destroy');

        // SPT Badan Lampiran L13B-B (Rekapitulasi Biaya Kegiatan)
        Route::post('/konsep/badan/l13bb', [SptBadanL13BBController::class, 'store'])->name('spt.badan.l13bb.store');
        Route::put('/konsep/badan/l13bb/{id}', [SptBadanL13BBController::class, 'update'])->name('spt.badan.l13bb.update');

        // SPT Badan Lampiran L13B-C (Fasilitas Pengurangan Penghasilan Bruto R&D)
        Route::post('/konsep/badan/l13bc', [SptBadanL13BCController::class, 'store'])->name('spt.badan.l13bc.store');
        Route::put('/konsep/badan/l13bc/{id}', [SptBadanL13BCController::class, 'update'])->name('spt.badan.l13bc.update');
        Route::delete('/konsep/badan/l13bc', [SptBadanL13BCController::class, 'destroy'])->name('spt.badan.l13bc.destroy');

        // SPT Badan Lampiran L13B-D (Penghitungan Tambahan Pengurangan Penghasilan Bruto)
        Route::post('/konsep/badan/l13bd', [SptBadanL13BDController::class, 'store'])->name('spt.badan.l13bd.store');
        Route::put('/konsep/badan/l13bd/{id}', [SptBadanL13BDController::class, 'update'])->name('spt.badan.l13bd.update');

        // SPT Badan Lampiran L13-C (Fasilitas Pengurangan PPh Badan)
        Route::post('/konsep/badan/l13c', [SptBadanL13CController::class, 'store'])->name('spt.badan.l13c.store');
        Route::put('/konsep/badan/l13c/{id}', [SptBadanL13CController::class, 'update'])->name('spt.badan.l13c.update');
        Route::delete('/konsep/badan/l13c', [SptBadanL13CController::class, 'destroy'])->name('spt.badan.l13c.destroy');

        // SPT Badan Lampiran L14 (Sisa Lebih Badan atau Lembaga Nirlaba)
        Route::post('/konsep/badan/l14', [SptBadanL14Controller::class, 'store'])->name('spt.badan.l14.store');
        Route::put('/konsep/badan/l14/{id}', [SptBadanL14Controller::class, 'update'])->name('spt.badan.l14.update');
        Route::delete('/konsep/badan/l14', [SptBadanL14Controller::class, 'destroy'])->name('spt.badan.l14.destroy');

        // SPT OP Lampiran L1 A1 (Kas dan Setara Kas)
        Route::post('/konsep/op/l1a1', [SptOpL1A1Controller::class, 'store'])->name('spt.op.l1a1.store');
        Route::put('/konsep/op/l1a1/{id}', [SptOpL1A1Controller::class, 'update'])->name('spt.op.l1a1.update');
        Route::delete('/konsep/op/l1a1', [SptOpL1A1Controller::class, 'destroy'])->name('spt.op.l1a1.destroy');

        // SPT OP Lampiran L1 A2 (Piutang)
        Route::post('/konsep/op/l1a2', [SptOpL1A2Controller::class, 'store'])->name('spt.op.l1a2.store');
        Route::put('/konsep/op/l1a2/{id}', [SptOpL1A2Controller::class, 'update'])->name('spt.op.l1a2.update');
        Route::delete('/konsep/op/l1a2', [SptOpL1A2Controller::class, 'destroy'])->name('spt.op.l1a2.destroy');

        // SPT OP Lampiran L1 A3 (Investasi/Sekuritas)
        Route::post('/konsep/op/l1a3', [SptOpL1A3Controller::class, 'store'])->name('spt.op.l1a3.store');
        Route::put('/konsep/op/l1a3/{id}', [SptOpL1A3Controller::class, 'update'])->name('spt.op.l1a3.update');
        Route::delete('/konsep/op/l1a3', [SptOpL1A3Controller::class, 'destroy'])->name('spt.op.l1a3.destroy');

        // SPT OP Lampiran L1 A4 (Harta Bergerak)
        Route::post('/konsep/op/l1a4', [SptOpL1A4Controller::class, 'store'])->name('spt.op.l1a4.store');
        Route::put('/konsep/op/l1a4/{id}', [SptOpL1A4Controller::class, 'update'])->name('spt.op.l1a4.update');
        Route::delete('/konsep/op/l1a4', [SptOpL1A4Controller::class, 'destroy'])->name('spt.op.l1a4.destroy');

        // SPT OP Lampiran L1 A5 (Harta Tidak Bergerak)
        Route::post('/konsep/op/l1a5', [SptOpL1A5Controller::class, 'store'])->name('spt.op.l1a5.store');
        Route::put('/konsep/op/l1a5/{id}', [SptOpL1A5Controller::class, 'update'])->name('spt.op.l1a5.update');
        Route::delete('/konsep/op/l1a5', [SptOpL1A5Controller::class, 'destroy'])->name('spt.op.l1a5.destroy');

        // SPT OP Lampiran L1 A6 (Harta Lain-Lain)
        Route::post('/konsep/op/l1a6', [SptOpL1A6Controller::class, 'store'])->name('spt.op.l1a6.store');
        Route::put('/konsep/op/l1a6/{id}', [SptOpL1A6Controller::class, 'update'])->name('spt.op.l1a6.update');
        Route::delete('/konsep/op/l1a6', [SptOpL1A6Controller::class, 'destroy'])->name('spt.op.l1a6.destroy');

        // SPT OP Lampiran L1 B (Utang)
        Route::post('/konsep/op/l1b', [SptOpL1BController::class, 'store'])->name('spt.op.l1b.store');
        Route::put('/konsep/op/l1b/{id}', [SptOpL1BController::class, 'update'])->name('spt.op.l1b.update');
        Route::delete('/konsep/op/l1b', [SptOpL1BController::class, 'destroy'])->name('spt.op.l1b.destroy');

        // SPT OP Lampiran L1 C (Tanggungan)
        Route::post('/konsep/op/l1c', [SptOpL1CController::class, 'store'])->name('spt.op.l1c.store');
        Route::put('/konsep/op/l1c/{id}', [SptOpL1CController::class, 'update'])->name('spt.op.l1c.update');
        Route::delete('/konsep/op/l1c', [SptOpL1CController::class, 'destroy'])->name('spt.op.l1c.destroy');

        // SPT OP Lampiran L1 D (Penghasilan Neto Pekerjaan)
        Route::post('/konsep/op/l1d', [SptOpL1DController::class, 'store'])->name('spt.op.l1d.store');
        Route::put('/konsep/op/l1d/{id}', [SptOpL1DController::class, 'update'])->name('spt.op.l1d.update');
        Route::delete('/konsep/op/l1d', [SptOpL1DController::class, 'destroy'])->name('spt.op.l1d.destroy');

        // SPT OP Lampiran L1 E (Bukti Pemotongan/Pemungutan PPh)
        Route::post('/konsep/op/l1e', [SptOpL1EController::class, 'store'])->name('spt.op.l1e.store');
        Route::put('/konsep/op/l1e/{id}', [SptOpL1EController::class, 'update'])->name('spt.op.l1e.update');
        Route::delete('/konsep/op/l1e', [SptOpL1EController::class, 'destroy'])->name('spt.op.l1e.destroy');

        // SPT OP Lampiran L2 A (Penghasilan yang Dikenakan PPh Final)
        Route::post('/konsep/op/l2a', [SptOpL2AController::class, 'store'])->name('spt.op.l2a.store');
        Route::put('/konsep/op/l2a/{id}', [SptOpL2AController::class, 'update'])->name('spt.op.l2a.update');
        Route::delete('/konsep/op/l2a', [SptOpL2AController::class, 'destroy'])->name('spt.op.l2a.destroy');

        // SPT OP Lampiran L2 B (Penghasilan yang Tidak Termasuk Objek Pajak)
        Route::post('/konsep/op/l2b', [SptOpL2BController::class, 'store'])->name('spt.op.l2b.store');
        Route::put('/konsep/op/l2b/{id}', [SptOpL2BController::class, 'update'])->name('spt.op.l2b.update');
        Route::delete('/konsep/op/l2b', [SptOpL2BController::class, 'destroy'])->name('spt.op.l2b.destroy');

        // SPT OP Lampiran L2 C (Penghasilan Neto Luar Negeri)
        Route::post('/konsep/op/l2c', [SptOpL2CController::class, 'store'])->name('spt.op.l2c.store');
        Route::put('/konsep/op/l2c/{id}', [SptOpL2CController::class, 'update'])->name('spt.op.l2c.update');
        Route::delete('/konsep/op/l2c', [SptOpL2CController::class, 'destroy'])->name('spt.op.l2c.destroy');

        // SPT OP Lampiran L3A-1 (A.1 Laba Rugi) + (A.2 Neraca)
        Route::post('/konsep/op/l3a13a1/sync', [SptOpL3A13A1Controller::class, 'sync'])->name('spt.op.l3a13a1.sync');
        Route::post('/konsep/op/l3a13a2/sync', [SptOpL3A13A2Controller::class, 'sync'])->name('spt.op.l3a13a2.sync');

        // SPT OP Lampiran L3A-4 (A & B)
        Route::post('/konsep/op/l3a4a/sync', [SptOpL3A4AController::class, 'sync'])->name('spt.op.l3a4a.sync');
        Route::post('/konsep/op/l3a4a/update-norma', [SptOpL3A4AController::class, 'updateNorma'])->name('spt.op.l3a4a.updateNorma');
        Route::post('/konsep/op/l3a4b/sync', [SptOpL3A4BController::class, 'sync'])->name('spt.op.l3a4b.sync');
        Route::post('/konsep/op/l3a4b/store', [SptOpL3A4BController::class, 'store'])->name('spt.op.l3a4b.store');
        Route::get('/spt-op-l3a4b/{id}', [SptOpL3A4BController::class, 'show'])->name('spt.op.l3a4b.show');
        Route::put('/spt-op-l3a4b/{id}', [SptOpL3A4BController::class, 'update'])->name('spt.op.l3a4b.update');
        Route::delete('/spt-op-l3a4b', [SptOpL3A4BController::class, 'destroy'])->name('spt.op.l3a4b.destroy');

        // SPT OP Lampiran L3B
        Route::post('/konsep/op/l3b/sync', [SptOpL3BController::class, 'sync'])->name('spt.op.l3b.sync');

        // SPT OP Lampiran L3C (Daftar Penyusutan/Amortisasi Fiskal)
        Route::post('/konsep/op/l3c', [SptOpL3CController::class, 'store'])->name('spt.op.l3c.store');
        Route::put('/konsep/op/l3c/{id}', [SptOpL3CController::class, 'update'])->name('spt.op.l3c.update');
        Route::delete('/konsep/op/l3c', [SptOpL3CController::class, 'destroy'])->name('spt.op.l3c.destroy');

        // SPT OP Lampiran L3D A/B/C (Daftar Nominatif)
        Route::post('/konsep/op/l3da', [SptOpL3DAController::class, 'store'])->name('spt.op.l3da.store');
        Route::put('/konsep/op/l3da/{id}', [SptOpL3DAController::class, 'update'])->name('spt.op.l3da.update');
        Route::delete('/konsep/op/l3da', [SptOpL3DAController::class, 'destroy'])->name('spt.op.l3da.destroy');

        Route::post('/konsep/op/l3db', [SptOpL3DBController::class, 'store'])->name('spt.op.l3db.store');
        Route::put('/konsep/op/l3db/{id}', [SptOpL3DBController::class, 'update'])->name('spt.op.l3db.update');
        Route::delete('/konsep/op/l3db', [SptOpL3DBController::class, 'destroy'])->name('spt.op.l3db.destroy');

        Route::post('/konsep/op/l3dc', [SptOpL3DCController::class, 'store'])->name('spt.op.l3dc.store');
        Route::put('/konsep/op/l3dc/{id}', [SptOpL3DCController::class, 'update'])->name('spt.op.l3dc.update');
        Route::delete('/konsep/op/l3dc', [SptOpL3DCController::class, 'destroy'])->name('spt.op.l3dc.destroy');

        // SPT OP Lampiran L4A (Angsuran PPh Pasal 25 Tahun Pajak Berikutnya)
        Route::post('/konsep/op/l4a/sync', [SptOpL4AController::class, 'sync'])->name('spt.op.l4a.sync');

        // SPT OP Lampiran L5A (Perhitungan Kompensasi Kerugian Fiskal)
        Route::post('/konsep/op/l5a/sync', [SptOpL5AController::class, 'sync'])->name('spt.op.l5a.sync');

        // SPT OP Lampiran L5B/C (Pengurang Penghasilan Neto & Pengurang PPh Terutang)
        Route::post('/konsep/op/l5bc', [SptOpL5BCController::class, 'store'])->name('spt.op.l5bc.store');
        Route::put('/konsep/op/l5bc/{id}', [SptOpL5BCController::class, 'update'])->name('spt.op.l5bc.update');
        Route::delete('/konsep/op/l5bc/{id}', [SptOpL5BCController::class, 'destroy'])->name('spt.op.l5bc.destroy');
    });
});

Route::middleware('auth')->group(function () {
    Route::prefix('payment')->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->name('payment');
        Route::get('/code-creation', [PaymentController::class, 'index'])->name('payment.creation');
        Route::post('/code-creation/store', [PaymentController::class, 'store'])->name('payment.store');
        Route::get('/billing', [PaymentController::class, 'billing'])->name('payment.billing');
        Route::post('/billing/{id}/pay', [PaymentController::class, 'payBilling'])->name('payment.payBilling');
        Route::post('/billing/group/{billingFormId}', [PaymentController::class, 'payBillingGroup'])
            ->name('payment.billing.group');
        Route::delete('/billing/group/{billingFormId}', [PaymentController::class, 'deleteBillingGroup'])
            ->name('payment.billing.group.delete');
        Route::get('/lihatPDF/{billingFormId}', [PaymentController::class, 'lihatPDF'])->name('payment.lihatPDF');
    });
});

Route::middleware('auth')->group(function () {
    Route::prefix('ledger')->group(function () {
        Route::get('/', [LedgerController::class, 'index'])->name('ledger');
        Route::get('/pdf', [LedgerController::class, 'generatePDF'])->name('ledger.pdf');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', EnsureAdmin::class])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin');
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/admin/users/create', [AdminController::class, 'create'])->name('admin.create');
    Route::post('/admin/users/store', [AdminController::class, 'store'])->name('admin.store');
    Route::get('/admin/users/{id}', [AdminController::class, 'show'])->name('admin.show');
    Route::get('/admin/users/{id}/edit', [AdminController::class, 'edit'])->name('admin.edit');
    Route::put('/admin/users/{id}', [AdminController::class, 'update'])->name('admin.update');
    Route::post('/admin/users/{id}/reset-password', [AdminController::class, 'resetPassword'])->name('admin.resetPassword');
    Route::post('/admin/users/reset-password-multiple', [AdminController::class, 'resetPasswordMultiple'])->name('admin.resetPasswordMultiple');
    Route::delete('/admin/users/destroy/{id}', [AdminController::class, 'destroy'])->name('admin.destroy');
    Route::get('/admin/users/template', [AdminController::class, 'downloadTemplate'])->name('admin.downloadTemplate');
    Route::post('/admin/users/import', [AdminController::class, 'import']);
    Route::delete('/admin/users/delete-multiple', [AdminController::class, 'deleteMultiple'])->name('admin.deleteMultiple');

    Route::get('/admin/teachers', [TeacherController::class, 'teacher'])->name('admin.teachers');
    Route::get('/admin/teachers/create', [TeacherController::class, 'create'])->name('admin.createTeacher');
    Route::post('/admin/teachers/store', [TeacherController::class, 'store'])->name('admin.storeTeacher');
    Route::get('/admin/teachers/{id}', [TeacherController::class, 'show'])->name('admin.showTeacher');
    Route::get('/admin/teachers/{id}/edit', [TeacherController::class, 'edit'])->name('admin.editTeacher');
    Route::put('/admin/teachers/{id}', [TeacherController::class, 'update'])->name('admin.updateTeacher');
    Route::delete('/admin/teachers/destroy/{id}', [TeacherController::class, 'destroy'])->name('admin.destroyTeacher');
    Route::get('/admin/teachers/template', [TeacherController::class, 'downloadTemplate'])->name('admin.downloadTemplateTeacher');
    Route::post('/admin/teachers/import', [TeacherController::class, 'import']);
    Route::delete('/admin/teachers/delete-multiple', [TeacherController::class, 'deleteMultiple'])->name('admin.deleteMultipleTeacher');
    Route::get('/admin/teachers/{id}/course/{courseId}', [TeacherController::class, 'showCourse'])->name('admin.showTeacherCourse');
    Route::get('/admin/teachers/{teacherId}/courses/{courseId}/modules', [TeacherController::class, 'showCourseModules'])->name('admin.showTeacherCourseModules');
    Route::get('/admin/teachers/{id}/test/{testId}', [TeacherController::class, 'showTest'])->name('admin.showTeacherTest');

    Route::get('/admin/events', [EventController::class, 'index'])->name('admin.events');
    Route::get('/admin/events/create', [EventController::class, 'create'])->name('admin.createEvent');
    Route::post('/admin/events/store', [EventController::class, 'store'])->name('admin.storeEvent');
    Route::get('/admin/events/{id}/edit', [EventController::class, 'edit'])->name('admin.editEvent');
    Route::put('/admin/events/{id}', [EventController::class, 'update'])->name('admin.updateEvent');
    Route::delete('/admin/events/destroy/{id}', [EventController::class, 'destroy'])->name('admin.destroyEvent');

    Route::get('/admin/courses', [AdminCourseListController::class, 'index'])->name('admin.courses');
    Route::get('/admin/tests', [AdminTestListController::class, 'index'])->name('admin.tests');
});

Route::middleware(['auth', EnsureTeacher::class])->group(function () {
    Route::get('/teacher', [TeacherController::class, 'index'])->name('teacher');
    Route::get('/teacher/dashboard', [TeacherController::class, 'index'])->name('teacher.dashboard');

    Route::get('/teacher/question-banks', [QuestionBankController::class, 'index'])->name('teacher.questionBanks');
    Route::get('/teacher/question-banks/create', [QuestionBankController::class, 'create'])->name('teacher.createQuestionBank');
    Route::post('/teacher/question-banks', [QuestionBankController::class, 'store'])->name('teacher.storeQuestionBank');
    Route::get('/teacher/question-banks/{id}/edit', [QuestionBankController::class, 'edit'])->name('teacher.editQuestionBank');
    Route::put('/teacher/question-banks/{id}', [QuestionBankController::class, 'update'])->name('teacher.updateQuestionBank');
    Route::delete('/teacher/question-banks/{id}', [QuestionBankController::class, 'destroy'])->name('teacher.destroyQuestionBank');

    Route::get('/teacher/question-banks/{questionBank}/questions', [QuestionBankQuestionController::class, 'index'])->name('teacher.questionBankQuestions.index');
    Route::get('/teacher/question-banks/{questionBank}/questions/create', [QuestionBankQuestionController::class, 'create'])->name('teacher.questionBankQuestions.create');
    Route::post('/teacher/question-banks/{questionBank}/questions', [QuestionBankQuestionController::class, 'store'])->name('teacher.questionBankQuestions.store');
    Route::get('/teacher/question-banks/{questionBank}/questions/{question}/edit', [QuestionBankQuestionController::class, 'edit'])->name('teacher.questionBankQuestions.edit');
    Route::put('/teacher/question-banks/{questionBank}/questions/{question}', [QuestionBankQuestionController::class, 'update'])->name('teacher.questionBankQuestions.update');
    Route::delete('/teacher/question-banks/{questionBank}/questions/{question}', [QuestionBankQuestionController::class, 'destroy'])->name('teacher.questionBankQuestions.destroy');
    Route::post('/teacher/question-banks/{questionBank}/questions/import', [QuestionBankQuestionController::class, 'import'])->name('teacher.questionBankQuestions.import');

    Route::get('/teacher/participants', [TeacherParticipantController::class, 'index'])->name('teacher.participants');
    Route::get('/teacher/participants/create', [TeacherParticipantController::class, 'create'])->name('teacher.createParticipant');
    Route::post('/teacher/participants', [TeacherParticipantController::class, 'store'])->name('teacher.storeParticipant');
    Route::get('/teacher/participants/{id}/edit', [TeacherParticipantController::class, 'edit'])->name('teacher.editParticipant');
    Route::put('/teacher/participants/{id}', [TeacherParticipantController::class, 'update'])->name('teacher.updateParticipant');
    Route::delete('/teacher/participants/{id}', [TeacherParticipantController::class, 'destroy'])->name('teacher.destroyParticipant');
    Route::post('/teacher/participants/import', [TeacherParticipantController::class, 'import'])->name('teacher.importParticipants');
    Route::delete('/teacher/participants/delete-multiple', [TeacherParticipantController::class, 'deleteMultiple'])->name('teacher.deleteMultipleParticipants');
    Route::get('/teacher/participants/template', [TeacherParticipantController::class, 'downloadTemplate'])->name('teacher.downloadParticipantTemplate');

    Route::get('/teacher/courses', [CourseController::class, 'index'])->name('teacher.courses');
    Route::get('/teacher/courses/create', [CourseController::class, 'create'])->name('teacher.createCourse');
    Route::post('/teacher/courses', [CourseController::class, 'store'])->name('teacher.storeCourse');
    Route::get('/teacher/courses/{id}', [CourseController::class, 'show'])->name('teacher.showCourse');
    Route::get('/teacher/courses/{id}/participants/{participantId}', [CourseController::class, 'showParticipant'])->name('teacher.showParticipant');
    Route::get('/teacher/courses/{id}/edit', [CourseController::class, 'edit'])->name('teacher.editCourse');
    Route::put('/teacher/courses/{id}', [CourseController::class, 'update'])->name('teacher.updateCourse');
    Route::delete('/teacher/courses/{id}', [CourseController::class, 'destroy'])->name('teacher.destroyCourse');
    Route::post('/teacher/courses/{id}/duplicate', [CourseController::class, 'duplicate'])->name('teacher.duplicateCourse');
    Route::delete('/teacher/courses/{courseId}/participants/{participantId}', [CourseController::class, 'removeParticipant'])->name('teacher.removeParticipant');
    Route::get('/teacher/search-users', [CourseController::class, 'searchUsers'])->name('teacher.searchUsers');
    Route::post('/teacher/courses/{courseId}/add-participant', [CourseController::class, 'addParticipant'])->name('teacher.addParticipant');
    Route::post('/teacher/courses/{id}/results', [CourseResultController::class, 'updateScore'])->name('teacher.scoreCourse');
    Route::delete('/teacher/courses/results/{id}/score', [CourseResultController::class, 'deleteScore'])->name('teacher.deleteScore');

    Route::post('/teacher/courses/{course}/schedules', [CourseScheduleController::class, 'store'])->name('teacher.courseSchedules.store');
    Route::put('/teacher/courses/{course}/schedules/{schedule}', [CourseScheduleController::class, 'update'])->name('teacher.courseSchedules.update');
    Route::delete('/teacher/courses/{course}/schedules/{schedule}', [CourseScheduleController::class, 'destroy'])->name('teacher.courseSchedules.destroy');

    Route::post('/teacher/courses/{course}/tests', [CourseTestController::class, 'store'])->name('teacher.courseTests.store');
    Route::get('/teacher/courses/{course}/tests/{courseTest}/detail', [CourseTestController::class, 'detail'])->name('teacher.courseTests.detail');
    Route::put('/teacher/courses/{course}/tests/{courseTest}', [CourseTestController::class, 'update'])->name('teacher.courseTests.update');
    Route::delete('/teacher/courses/{course}/tests/{courseTest}', [CourseTestController::class, 'destroy'])->name('teacher.courseTests.destroy');

    Route::get('/teacher/courses/{course}/modules', [CourseModuleController::class, 'index'])->name('course.modules.index');
    Route::get('/teacher/courses/{course}/modules/create', [CourseModuleController::class, 'create'])->name('course.modules.create');
    Route::post('/teacher/courses/{course}/modules', [CourseModuleController::class, 'store'])->name('course.modules.store');
    Route::get('/teacher/courses/{course}/modules/{module}', [CourseModuleController::class, 'show'])->name('course.modules.show');
    Route::get('/teacher/courses/{course}/modules/{module}/edit', [CourseModuleController::class, 'edit'])->name('course.modules.edit');
    Route::put('/teacher/courses/{course}/modules/{module}', [CourseModuleController::class, 'update'])->name('course.modules.update');
    Route::delete('/teacher/courses/{course}/modules/{module}', [CourseModuleController::class, 'destroy'])->name('course.modules.destroy');

    Route::get('/teacher/test', [TestController::class, 'index'])->name('teacher.tests');
    Route::get('/teacher/test/create', [TestController::class, 'create'])->name('teacher.createTest');
    Route::post('/teacher/test', [TestController::class, 'store'])->name('teacher.storeTest');
    Route::get('/teacher/test/{id}', [TestController::class, 'show'])->name('teacher.showTest');
    Route::get('/teacher/test/{id}/detail', [TestController::class, 'detail'])->name('teacher.detailTest');
    Route::get('/teacher/test/{id}/participants/{participantId}', [TestController::class, 'showParticipant'])->name('teacher.showTestParticipant');
    Route::get('/teacher/test/{id}/result/{attemptId}', [TestController::class, 'resultAttempt'])->name('teacher.testResult');
    Route::get('/teacher/test/{id}/edit', [TestController::class, 'edit'])->name('teacher.editTest');
    Route::put('/teacher/test/{id}', [TestController::class, 'update'])->name('teacher.updateTest');
    Route::delete('/teacher/test/{id}', [TestController::class, 'destroy'])->name('teacher.destroyTest');
    Route::post('/teacher/test/{id}/duplicate', [TestController::class, 'duplicate'])->name('teacher.duplicateTest');
    Route::delete('/teacher/test/{testId}/participants/{participantId}', [TestController::class, 'removeParticipant'])->name('teacher.removeTestParticipant');
    // Route::get('/teacher/search-users', [TestController::class, 'searchUsers'])->name('teacher.searchUsers');
    Route::post('/teacher/test/{testId}/add-participant', [TestController::class, 'addParticipant'])->name('teacher.addTestParticipant');
    Route::post('/teacher/test/{id}/update-show-score', [TestController::class, 'updateShowScore'])->name('teacher.updateShowScore');

    // Question routes - menggunakan QuestionController
    Route::put('/teacher/test/{test}/questions-to-show', [QuestionController::class, 'updateQuestionsToShow'])->name('test.question.updateQuestionsToShow');
    // Route::get('/teacher/test/questions/download-template', [QuestionController::class, 'downloadTemplateQuestion'])->name('test.question.download-template');

    Route::post('/teacher/test/{id}/results', [CourseResultController::class, 'updateScore'])->name('teacher.scoreTest');
    Route::delete('/teacher/test/results/{id}/score', [CourseResultController::class, 'deleteScore'])->name('teacher.deleteTestScore');
    Route::get('/teacher/test/{id}/export-participants', [TestController::class, 'exportParticipants'])->name('teacher.exportTestParticipants');
    Route::delete('/teacher/participants/{participant}/average-score', [CourseResultController::class, 'deleteAverageScore'])->name('teacher.deleteAverageScore');
    Route::post('/teacher/participants/{participant}/feedback', [TestResultController::class, 'giveFeedback'])->name('teacher.giveFeedback');
    Route::post('/teacher/participants/{participant}/delete-feedback', [TestResultController::class, 'deleteFeedback'])->name('teacher.deleteFeedback');
});

Route::prefix('api')->group(function () {
    Route::prefix('region')->group(function () {
        Route::get('provinces', [RegionController::class, 'provinces'])->name('api.region.provinces');
        Route::get('regencies/{provinceId}', [RegionController::class, 'regencies'])->name('api.region.regencies');
        Route::get('districts/{regencyId}', [RegionController::class, 'districts'])->name('api.region.districts');
        Route::get('villages/{districtId}', [RegionController::class, 'villages'])->name('api.region.villages');
        Route::get('coordinates/{villageCode}', [RegionController::class, 'getCoordinates'])->name('api.region.coordinates');
    });
});

require __DIR__ . '/auth.php';
