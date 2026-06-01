import { useState, useEffect } from "react";

interface LocationData {
  city: string;
  loading: boolean;
}

export function useLocation(): LocationData {
  const [location, setLocation] = useState<LocationData>({
    city: "",
    loading: true,
  });

  useEffect(() => {
    const cached = localStorage.getItem("userCity");
    if (cached) {
      setLocation({ city: cached, loading: false });
      return;
    }

    if (!navigator.geolocation) {
      setLocation({ city: "", loading: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.municipality ||
            "";
          if (city) {
            const state = data.address?.state || "";
            const display = state ? `${city} - ${state}` : city;
            localStorage.setItem("userCity", display);
            setLocation({ city: display, loading: false });
          } else {
            setLocation({ city: "", loading: false });
          }
        } catch {
          setLocation({ city: "", loading: false });
        }
      },
      () => {
        setLocation({ city: "", loading: false });
      },
      { timeout: 5000 }
    );
  }, []);

  return location;
}
