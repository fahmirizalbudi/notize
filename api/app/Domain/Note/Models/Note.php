<?php

namespace App\Domain\Note\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Class Note
 * 
 * Represents a user's note entity in the system.
 * 
 * @package App\Domain\Note\Models
 * @property string $id Unique identifier (UUID)
 * @property string|null $title The title of the note
 * @property string|null $body The content of the note
 * @property bool $is_favorite Whether the note is marked as favorite
 * @property bool $is_archived Whether the note is archived
 * @property \Illuminate\Support\Carbon|null $last_edited_at Last timestamp the note was modified
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Note extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'id',
        'title',
        'body',
        'is_favorite',
        'is_archived',
        'last_edited_at',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'is_favorite' => 'boolean',
        'is_archived' => 'boolean',
        'last_edited_at' => 'datetime',
    ];

    /** @var string */
    protected $keyType = 'string';

    /** @var bool */
    public $incrementing = false;

    /**
     * Bootstrap the model and its traits.
     * Generates UUID and default timestamp on creation.
     * 
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
            if (empty($model->last_edited_at)) {
                $model->last_edited_at = now();
            }
        });
    }
}
