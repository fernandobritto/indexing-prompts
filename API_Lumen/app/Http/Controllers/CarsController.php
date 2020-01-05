<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Cars;

class CarsController extends Controller
{

    private $model;

    public function __construct()
    {
        $this->model = $vehicles;
    }

    public function getAll()
    {
        $vehicles = $this->model->all();
        return response()->json($vehicles);
    }

    public function get($id)
    {
        $vehicles = $this->model->find($id);
        return response()->json($vehicle);

    }

    public function store(Request $request)
    {
        $vehicle = $this->model->create($request->all());
        return response()->json($vehicle);

    }

    public function update($id, Request $request)
    {
        $vehicle = $this->model->find($id)->update($request->all());
        return response()->json($vehicle);

    }

    public function delete($id)
    {
        $vehicle = $this->model->find($id)
        return response()->json($vehicle);
    }
}
