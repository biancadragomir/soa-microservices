class VehiclesRepo {
  vehicles: any[] = [];

  addVehicle(vehicle) {
    this.vehicles.push(vehicle);
  }

  getVehicles() {
    return this.vehicles;
  }

  deleteVehicle(vehicleToDelete) {
    const updatedList = this.vehicles.filter(
      curr => curr.name !== vehicleToDelete,
    );
    this.vehicles = updatedList;
  }
}

export default VehiclesRepo;
