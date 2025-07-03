<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\UserDetails;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
          $user = User::query()
            ->where('email', $request->only('email'))
            ->first();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'user_not_found',
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' =>'incorrect_email_or_password',
            ], 404);
        }

        if ($token = Auth::attempt(array_merge($request->only('password'), ['email' => $user->email]))) {
            $user = Auth::user();
            $token = $user->createToken('laravel')->accessToken;
            return $this->respondWithToken($token);
        }
    }

     private function respondWithToken($token): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Carbon::now()->addYears()->timestamp,
            'user' => auth()->user(),
            
        ]);
    }
      private function guard(): \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
    {
        return Auth::guard('api');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
    public function userStore(Request $request){
        $user = User::create([
            'name'=>$request->username,
            'email'=>$request->email,
            'phone'=>$request->phone,
            'address'=>$request->address
        ]);

        $user->details()->createMany($request->users);

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user,
            'status'=>true
        ], 201); // 201 = Created
    }

}
