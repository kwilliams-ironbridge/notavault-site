import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { C, MONO } from '@/lib/theme';

export interface Point {
  v: number;
  label: string;
}

export function LineChart({ points, format, width = 300, height = 120 }: { points: Point[]; format: (v: number) => string; width?: number; height?: number }) {
  if (points.length < 2) {
    return (
      <View style={{ height, justifyContent: 'center' }}>
        <Text style={{ color: C.muted, fontSize: 13 }}>
          {points.length === 1 ? 'One reading. The line starts on your next re-test.' : 'No readings yet.'}
        </Text>
      </View>
    );
  }
  const P = 24;
  const vals = points.map((p) => p.v);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  const x = (i: number) => P + (i * (width - 2 * P)) / (points.length - 1);
  const y = (v: number) => height - P - ((v - lo) / span) * (height - 2 * P);
  const poly = points.map((p, i) => `${x(i)},${y(p.v)}`).join(' ');
  return (
    <Svg width={width} height={height}>
      <Line x1={P} y1={height - P} x2={width - P} y2={height - P} stroke={C.line} strokeWidth={1} />
      <Line x1={P} y1={P} x2={width - P} y2={P} stroke={C.line} strokeWidth={1} />
      <Polyline points={poly} fill="none" stroke={C.accent} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <Circle key={i} cx={x(i)} cy={y(p.v)} r={3.5} fill={C.bg} stroke={C.accent} strokeWidth={2} />
      ))}
      <SvgText x={P} y={height - 6} fill={C.muted} fontFamily={MONO} fontSize={10}>{points[0].label}</SvgText>
      <SvgText x={width - P} y={height - 6} fill={C.muted} fontFamily={MONO} fontSize={10} textAnchor="end">{points[points.length - 1].label}</SvgText>
      <SvgText x={width - P} y={P - 6} fill={C.muted} fontFamily={MONO} fontSize={10} textAnchor="end">{format(hi)}</SvgText>
      <SvgText x={width - P} y={height - P - 6} fill={C.muted} fontFamily={MONO} fontSize={10} textAnchor="end">{format(lo)}</SvgText>
    </Svg>
  );
}
