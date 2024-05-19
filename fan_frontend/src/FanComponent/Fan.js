import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Switch } from "@chakra-ui/react";
import { Radio, RadioGroup, Stack,CircularProgress } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'



const Fan = () => {
  const [fanstatus, setFanstatus] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [energyData, setEnergyData] = useState(null);
  const [logs, setLogs] = useState([]);


  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/logs/');
        setLogs(response.data);
      } catch (error) {
        setError('There was an error fetching the logs!');
      }
    };

    fetchLogs();
  }, [fanstatus,speed]);




  useEffect(() => {
    GetfanDetails();
  }, []);

  const GetfanDetails = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/fandetails/");
      if (res.status === 200) {
        setFanstatus(res.data.status);
        setSpeed(res.data.speed);
      }
    } catch (error) {
      if (error.response.status === 406) {
        setError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  const HandleStatus = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/fandetails/");
      if (res.status === 201) {
        console.log("hellooo");
        setFanstatus(res.data.status);
        setSpeed(res.data.speed);
      }
    } catch (error) {
      if (error.response.status === 406) {
        setError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  const handleSpeed = async (e) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/fanspeedadjust/",
        { speed_level: e }
      );
      if (res.status === 201) {
        setFanstatus(res.data.status);
        setSpeed(res.data.speed);
      }
    } catch (error) {
      if (error.response.status === 406) {
        setError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  const GettEnergy = () => {
    if (endDate && startDate) {
      axios
        .get("http://localhost:8000/api/powerdetails/", {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        })
        .then((response) => {
          console.log(response.data);
          setEnergyData(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the fan data!", error);
        });
    } else {
      setError("Select both date");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div>
        <h1>Fan Controller</h1>
        {fanstatus === true ? <h3>Fan On</h3> : <h3>Fan Off</h3>}
        <CircularProgress isIndeterminate={fanstatus} color='green.300' />
        {speed && fanstatus ? <h3>Current speed is {speed}</h3> : <h3></h3>}



        <RadioGroup  defaultValue={speed}>
          <Stack spacing={4} direction="row">
            <Radio value="1"  onClick={() => handleSpeed(1)}>
              speed 1
            </Radio>
            <Radio value="2" onClick={() => handleSpeed(2)}>
              speed 2
            </Radio>
            <Radio value="3" onClick={() => handleSpeed(3)}>
              speed 3
            </Radio>
            <Radio value="4" onClick={() => handleSpeed(4)}>
              speed 4
            </Radio>
            <Radio value="5" onClick={() => handleSpeed(5)}>
              speed 5
            </Radio>
          </Stack>
        </RadioGroup>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10vh",
            flexDirection: "column",
          }}
        >
          <RadioGroup
            defaultValue={fanstatus}
            onChange={HandleStatus}
            value={fanstatus}
          >
            <Stack spacing={5} direction="row">
              <Radio colorScheme="green" value={true}>
                ON
              </Radio>
              <Radio colorScheme="red" value={false}>
                OFF
              </Radio>
            </Stack>
          </RadioGroup>
        </div>

        <Input
          placeholder="Select Start Date and Time"
          size="md"
          type="datetime-local"
          onChange={(event) => setStartDate(event.target.value)}
          value={startDate}
        />
        <Input
          placeholder="Select End Date and Time"
          size="md"
          type="datetime-local"
          onChange={(event) => setEndDate(event.target.value)}
          value={endDate}
        />
        <Button colorScheme="blue" onClick={GettEnergy}>
          submit
        </Button>
        <h2 color="red">{error}</h2>
        {energyData ? (
          <div>
            <h1>Energy Data</h1>
            <p>Power: {energyData.energy}</p>
            <p>Energy: {energyData.power}</p>
          </div>
        ) : null}

<TableContainer>
  <Table size='sm'>
    <Thead>
      <Tr>
        <Th>Changes</Th>
        <Th>Fan Status</Th>
        <Th >Speed Level</Th>
        <Th >Time</Th>
      </Tr>
    </Thead>
    <Tbody>

        {logs.map((ev,key)=>{
            return(
                <Tr key={ev.id}>
                <Td>{ev.change}</Td>
                <Td >{ev.status?"ON":"OFF "}</Td> 

                <Td>{ev.speed_level}</Td>
                <Td >{ev.timestamp}</Td>
              </Tr>

        )
        })}
     
    
    
    </Tbody>
  
  </Table>
</TableContainer>



      </div>
    </div>
  );
};

export default Fan;
