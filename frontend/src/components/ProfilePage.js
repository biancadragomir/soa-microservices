import firebase from "firebase/app";
import React, { useContext, useState } from "react";
import { auth } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import Button from "react-bootstrap/Button";
import Spacer from "./Spacer";
import { Card, Row, Col } from "react-bootstrap";

const ProfilePage = () => {
  const user = useContext(UserContext);
  const { displayName, email } = user;
  const [vehicles, setVehicles] = useState([]);
  const [ownedVehicles, setOwnedVehicles] = useState([]);

  const saveNewVehicle = async (vehicleUrl) => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(async (token) => {
        console.log("posting...");
        let url = new URL("http://localhost:3002/addVehicles");
        console.log({ url: vehicleUrl });

        const response = await fetch(url, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({ url: vehicleUrl }),
        });
        const vehicles = await response.json();
        setOwnedVehicles(vehicles);
        console.log(vehicles);
      });
  };

  const deleteVehicle = async (vehicleName) => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(async (token) => {
        console.log("DELETE...");
        let url = new URL("http://localhost:3002/deleteVehicles");
        console.log({ name: vehicleName });

        const response = await fetch(url, {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({ name: vehicleName }),
        });
        const vehicles = await response.json();
        setOwnedVehicles(vehicles);
        console.log(vehicles);
      });
  };

  const fetchVehicles = async () => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(async (token) => {
        console.log("getting...");
        let url = new URL("http://localhost:3002/vehicles");
        const response = await fetch(url, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        const items = data.results;
        console.log(items);
        items.map((currentItem) => {
          items.push({
            name: currentItem.name,
            model: currentItem.model,
            manufacturer: currentItem.manufacturer,
          });
        });
        setVehicles(items);
      });
  };

  const getButtonsSection = () => {
    return (
      <Row
        style={{
          justifyContent: "center",
        }}
      >
        <Button
          style={{ height: 40, marginLeft: 16 }}
          onClick={() => fetchVehicles()}
        >
          Get vehicles
        </Button>
        <Button
          style={{ height: 40, marginLeft: 16 }}
          className="btn-danger"
          onClick={() => {
            auth.signOut();
          }}
        >
          Sign out
        </Button>
      </Row>
    );
  };

  const buildVehiclesList = () => {
    return vehicles.map((currentVehicle) => {
      return (
        <Card style={{ margin: 16, width: 500 }}>
          <div>
            <Row>
              <Button
                onClick={() => {
                  const remainingBuyableVehicles = vehicles.filter(
                    (v) => v.name !== currentVehicle.name
                  );
                  setVehicles(remainingBuyableVehicles);
                  console.log("saving ", currentVehicle.url);
                  saveNewVehicle(currentVehicle.url);
                }}
              >
                +
              </Button>
              <div className="column" style={{ padding: 16 }}>
                <h2 className="text-3xl mb-2 font-bold">
                  {currentVehicle.name}
                </h2>
                <h6 className="text-3xl mb-2  font-bold">
                  {currentVehicle.model}
                </h6>
                <h6 className="text-3xl mb-2  font-bold">
                  {currentVehicle.manufacturer}
                </h6>
              </div>
            </Row>
          </div>
        </Card>
      );
    });
  };

  const buildOwnedVehiclesList = () => {
    return ownedVehicles.map((currentVehicle) => {
      return (
        <Card style={{ margin: 16, width: 500 }}>
          <div>
            <Row>
              <Button
                className="btn-danger"
                onClick={() => {
                  deleteVehicle(currentVehicle.name);
                  setVehicles([currentVehicle, ...vehicles]);
                }}
              >
                -
              </Button>
              <div className="column" style={{ padding: 16 }}>
                <h2 className="text-3xl mb-2 font-bold">
                  {currentVehicle.name}
                </h2>
                <h6 className="text-3xl mb-2  font-bold">
                  {currentVehicle.model}
                </h6>
                <h6 className="text-3xl mb-2  font-bold">
                  {currentVehicle.manufacturer}
                </h6>
              </div>
            </Row>
          </div>
        </Card>
      );
    });
  };

  return (
    <div className="column w-11/12 md:w-2/4 py-8 px-4 md:px-8 ">
      <Spacer />
      <h1 className="text-3xl mb-2 text-center font-bold">Hello!</h1>
      <div style={{ marginTop: 100 }} />
      <Row
        style={{
          justifyContent: "center",
        }}
      >
        <div className="card" style={{ width: "18rem", padding: 16 }}>
          <h4 class="card-title">Your information</h4>
          <h2 className="text-2xl font-semibold">{displayName}</h2>
          <h3 className="italic">{email}</h3>
        </div>
        <div style={{ marginLeft: 16 }}></div>
        {getButtonsSection()}
      </Row>
      <Spacer />
      <Row>
        <Col>
          <h2>Available vehicles:</h2>
          {buildVehiclesList()}
        </Col>
        <Col>
          <h2>Your vehicles</h2>
          {buildOwnedVehiclesList()}
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
