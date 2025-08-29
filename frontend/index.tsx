import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function Home() {
  const [data, setData] = useState<{ date: string; sunshine_hours: number }[]>(
    []
  );

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/sunshine")
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  const labels = data.map((item) => item.date).reverse();
  const sunshine = data.map((item) => item.sunshine_hours).reverse();

  const avg =
    sunshine.length > 0
      ? (sunshine.reduce((a, b) => a + b, 0) / sunshine.length).toFixed(1)
      : "0";
  const maxVal = sunshine.length > 0 ? Math.max(...sunshine) : 0;
  const minVal = sunshine.length > 0 ? Math.min(...sunshine) : 0;

  const maxIndex = sunshine.indexOf(maxVal);
  const minIndex = sunshine.indexOf(minVal);

  const maxDate = labels[maxIndex] || "-";
  const minDate = labels[minIndex] || "-";

  return (
    <LinearGradient
      colors={["#1E3C72", "#2A5298"]}
      style={styles.gradientContainer}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>🌞 Sunshine Duration Analysis</Text>

        {data.length > 0 && (
          <LineChart
            data={{ labels, datasets: [{ data: sunshine }] }}
            width={Dimensions.get("window").width - 40}
            height={280}
            yAxisSuffix="h"
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "#1E3C72",
              backgroundGradientTo: "#2A5298",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#FFD700",
              },
            }}
            bezier
            style={styles.chart}
          />
        )}

        <View style={styles.cardsContainer}>
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.icon}>☀️</Text>
            <Text style={styles.title}>Average Sunshine</Text>
            <Text style={styles.value}>{avg} hrs</Text>
          </BlurView>

          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.icon}>📊</Text>
            <Text style={styles.title}>Max Sunshine</Text>
            <Text style={styles.value}>{maxVal} hrs</Text>
            <Text style={styles.date}>Date: {maxDate}</Text>
          </BlurView>

          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.icon}>🌥️</Text>
            <Text style={styles.title}>Min Sunshine</Text>
            <Text style={styles.value}>{minVal} hrs</Text>
            <Text style={styles.date}>Date: {minDate}</Text>
          </BlurView>
        </View>

        <Text style={styles.footer}>Data Source: FastAPI | Updated: Today</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: {
    alignItems: "center",
    paddingVertical: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  chart: {
    marginVertical: 12,
    borderRadius: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30,
    width: "100%",
    paddingHorizontal: 10,
  },
  card: {
    width: 140, // increased width
    height: 150,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 5,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    paddingVertical: 10,
  },
  icon: { fontSize: 32, marginBottom: 8 },
  title: { fontSize: 14, color: "#fff", textAlign: "center" },
  value: { fontSize: 18, color: "#FFD700", fontWeight: "bold" },
  date: { fontSize: 12, color: "#ccc", marginTop: 4 },
  footer: {
    textAlign: "center",
    marginTop: 20,
    color: "#ddd",
    fontStyle: "italic",
  },
});
