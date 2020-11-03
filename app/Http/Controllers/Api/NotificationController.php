<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Notification;

class NotificationController extends Controller
{
    public function update(Request $request)
    {
        $ids = $request->input('ids');

        Notification::whereIn('id', $ids)
                    ->update(['is_read' => true]);

        return response('updated');
    }
}
