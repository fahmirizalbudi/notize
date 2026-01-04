<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
  public function __construct(
    protected Model $model
  ) {
  }

  public function find($id): ?Model
  {
    return $this->model->find($id);
  }

  public function findAll()
  {
    return $this->model->get();
  }

  public function create($data)
  {
    return $this->model->create($data);
  }

  public function update($id, $data)
  {
    $model = $this->model->findOrFail($id);
    $model->update($data);
    return $model;
  }

  public function delete($id)
  {
    $model = $this->model->findOrFail($id);
    $model->delete();
    return $model;
  }
}