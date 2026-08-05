<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:9999999999'],
            'due_day' => ['required', 'integer', 'between:1,31'],
            'due_month' => ['nullable', 'integer', 'between:1,12'],
            'frequency' => ['required', Rule::in(['monthly', 'yearly'])],
            'auto_pay' => ['sometimes', 'boolean'],
            'active' => ['sometimes', 'boolean'],
            'reminder_days' => ['required', 'integer', 'between:0,30'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
