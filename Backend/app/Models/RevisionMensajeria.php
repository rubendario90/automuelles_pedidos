<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevisionMensajeria extends Model
{
    protected $table = 'revisiones_mensajeria';
    protected $fillable = ['user_id', 'data'];
    protected $casts = ['data' => 'array'];
}