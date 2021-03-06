import test from 'tape'
import { GaugeMetric } from '../../../src/telemetry/metrics/gauge'

test('Gauge metrics', (t): void => {
  function recentTimestamp(t: number, range: number = 5000): boolean {
    const now = Date.now()
    return t >=  now - range && t <= now + range
  }

  t.test('should accept optional attributes and timestamps', (t): void => {
    let g = new GaugeMetric(
      'test gauge',
      1234
    )
    t.equal(g.value, 1234, 'should have proper value')
    t.equal(g.name, 'test gauge', 'should have proper name')
    t.notOk(g.attributes, 'should have no attributes')
    t.ok(recentTimestamp(g.timestamp), 'should have a timestamp')
    t.equal(g['interval.ms'], undefined, 'should have no interval')

    g = new GaugeMetric(
      'test gauge',
      1234,
      {
        testAttribute: 'asdf'
      },
      4321
    )
    t.equal(g.value, 1234, 'should have proper value')
    t.equal(g.name, 'test gauge', 'should have proper name')
    t.ok(g.attributes, 'should have no attributes')
    t.equal(g.attributes.testAttribute, 'asdf', 'should have proper attributes')
    t.equal(g.timestamp, 4321, 'should have a timestamp')
    t.equal(g['interval.ms'], undefined, 'should have no interval')
    t.end()
  })

  t.test('should keep the last recorded value', (t): void => {
    let g = new GaugeMetric(
      'test gauge',
      1234,
      undefined,
      1234
    )
    t.equal(g.value, 1234, 'should have expected value')
    g.record(2345)
    t.ok(recentTimestamp(g.timestamp), 'timestamp should update on record')
    t.equal(g.value, 2345, 'should have expected value')
    t.end()
  })

  t.end()
})
