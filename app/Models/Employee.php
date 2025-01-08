<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $table = 'employees';
    protected $fillable = ['emp_no', 'first_name', 'last_name', 'birth_date', 'position', 'department'];
}
