import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

import {
  initialize,
  requestPermission,
  readRecords,
  requestExerciseRoute,
} from 'react-native-health-connect';

export default function App() {
  const [text, setText] = useState('Loading...');

  useEffect(() => {
    loadWorkout();
  }, []);

  async function loadWorkout() {
    try {
      const initialized = await initialize();

      if (!initialized) {
        setText('Health Connect is not available');
        return;
      }

      const permissions = await requestPermission([
        {
          accessType: 'read',
          recordType: 'ExerciseSession',
        },
      ]);

      console.log('Permissions:', permissions);

      const { records } = await readRecords('ExerciseSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: '2024-01-01T00:00:00.000Z',
          endTime: new Date().toISOString(),
        },
      });

      const workout = records[0];
      console.log(workout.exerciseRoute);

      if (records.length === 0) {
        setText('No workouts found');
        return;
      }

      const latest = records[records.length - 1];

      setText(JSON.stringify(latest, null, 2));
    } catch (e) {
      console.error(e);
      setText(JSON.stringify(e, null, 2));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>{text}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});