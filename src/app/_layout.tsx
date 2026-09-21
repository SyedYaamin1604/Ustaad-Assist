import "../global.css";
import { Stack } from "expo-router";


//replace title with headerShown: false property at the time of developing

const RootLayout = () => {

  return (
    <Stack>
      <Stack.Screen name="Home" options={{title: "Home"}} />
      {/* <Stack.Screen name="Home" options={{title: "Home"}} />
      <Stack.Screen name="Home" options={{title: "Home"}} />
      <Stack.Screen name="Home" options={{title: "Home"}} />
      <Stack.Screen name="Home" options={{title: "Home"}} /> */}
    </Stack>
  );

}

export default RootLayout;

