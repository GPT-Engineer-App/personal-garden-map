import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, useToast, Grid, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { FaPlus, FaInfoCircle } from "react-icons/fa";

const API_URL = "https://backengine-e1sb.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [gardenDesign, setGardenDesign] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 204) {
        toast({
          title: "Signup Successful",
          description: "You can now login with your credentials",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Signup Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleSaveGarden = async () => {
    try {
      const response = await fetch(`${API_URL}/garden-projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: "My Garden",
          design: JSON.stringify(gardenDesign),
        }),
      });

      if (response.ok) {
        toast({
          title: "Garden Saved",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Save Failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Save garden error:", error);
    }
  };

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
    onOpen();
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Personal Garden
      </Heading>

      {!isLoggedIn ? (
        <Box>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" onClick={handleLogin} mr={4}>
            Login
          </Button>
          <Button onClick={handleSignup}>Signup</Button>
        </Box>
      ) : (
        <Box>
          <Text mb={4}>Welcome! Create your garden design.</Text>
          <Grid templateColumns="repeat(5, 1fr)" gap={4} mb={4}>
            {["grass", "mud", "dirt"].map((type) => (
              <Box key={type} bg={type} h="100px" display="flex" alignItems="center" justifyContent="center" color="white" cursor="pointer" onClick={() => setGardenDesign([...gardenDesign, { type, plant: null }])}>
                {type}
              </Box>
            ))}
          </Grid>
          <Grid templateColumns="repeat(5, 1fr)" gap={4} mb={4}>
            {["tree", "flower", "fruit", "berry", "vegetable"].map((plant) => (
              <Box key={plant} display="flex" alignItems="center" justifyContent="center" cursor="pointer" onClick={() => handlePlantClick(plant)}>
                <Image src={`https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwxfHwlMjQlN0JwbGFudCU3RHxlbnwwfHx8fDE3MTEzNzk0OTB8MA&ixlib=rb-4.0.3&q=80&w=1080`} alt={plant} w="100px" h="100px" objectFit="cover" />
              </Box>
            ))}
          </Grid>
          <Box mb={4}>
            <Heading as="h2" size="lg" mb={2}>
              Your Garden Design
            </Heading>
            <Grid templateColumns="repeat(5, 1fr)" gap={4}>
              {gardenDesign.map((cell, index) => (
                <Box key={index} bg={cell.type} h="100px" display="flex" alignItems="center" justifyContent="center" color="white" position="relative">
                  {cell.plant && <Image src={`https://placehold.co/600x400`} alt={cell.plant} w="80px" h="80px" objectFit="cover" />}
                  <Button size="xs" position="absolute" top={1} right={1} onClick={() => setGardenDesign(gardenDesign.filter((_, i) => i !== index))}>
                    X
                  </Button>
                </Box>
              ))}
            </Grid>
          </Box>
          <Button leftIcon={<FaPlus />} onClick={handleSaveGarden}>
            Save Garden
          </Button>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Plant Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPlant && (
              <Box>
                <Heading as="h3" size="md" mb={2}>
                  {selectedPlant}
                </Heading>
                <Image src={`https://placehold.co/600x400`} alt={selectedPlant} mb={4} />
                <Text>Here you can find information about {selectedPlant}, its diseases, and pests.</Text>
                <Button leftIcon={<FaInfoCircle />} variant="link" colorScheme="blue">
                  Learn More
                </Button>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
