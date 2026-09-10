// Local daily reminder at 8:00 pm. Built lazily; a failure turns the toggle back off.
export async function enableReminder(): Promise<boolean> {
  try {
    const N = await import('expo-notifications');
    const perm = await N.requestPermissionsAsync();
    if (!perm.granted) return false;
    await N.cancelAllScheduledNotificationsAsync();
    await N.scheduleNotificationAsync({
      content: { title: 'FourCount', body: 'Five minutes. One drill. Then the graph moves.' },
      trigger: { type: N.SchedulableTriggerInputTypes.DAILY, hour: 20, minute: 0 },
    });
    return true;
  } catch (e) {
    if (__DEV__) console.warn('[reminders] enable failed', e);
    return false;
  }
}

export async function disableReminder(): Promise<void> {
  try {
    const N = await import('expo-notifications');
    await N.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    if (__DEV__) console.warn('[reminders] disable failed', e);
  }
}
