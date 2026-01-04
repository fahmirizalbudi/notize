<?php

namespace App\Http\Response;

final class ResponseJSON
{
  public static function success($message, $data = null)
  {
    return response()->json([
      'success' => true,
      'message' => $message,
      'data' => $data
    ], 200);
  }

  public static function unauthorized($message, $data = null)
  {
    return response()->json([
      'success' => false,
      'message' => $message ? $message : 'Unauthorized',
      'data' => $data
    ], 401);
  }
}