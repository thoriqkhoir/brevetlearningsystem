<?php

namespace App\Http\Controllers;

use App\Models\BusinessEntity;
use Illuminate\Http\Request;

class ImpersonationController extends Controller
{
    public function actAsPersonal(Request $request)
    {
        session()->forget('active_business_entity_id');
        return back()->with('success', 'Bertindak sebagai: Orang Pribadi');
    }

    public function actAsBusiness(Request $request, string $id)
    {
        $entity = BusinessEntity::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        session(['active_business_entity_id' => $entity->id]);

        return back()->with('success', 'Bertindak sebagai badan: ' . $entity->name);
    }
}
