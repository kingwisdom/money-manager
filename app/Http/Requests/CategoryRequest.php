<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:60'],
            'type' => ['required', Rule::in(['income', 'expense'])],
            'icon' => ['required', 'string', 'max:50'],
            'color' => ['required', 'string', 'max:20'],
            'budget_limit' => ['nullable', 'numeric', 'min:0', 'max:9999999999'],
        ];
    }
}
