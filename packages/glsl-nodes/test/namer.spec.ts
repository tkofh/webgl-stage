import { describe, test } from 'vitest'
import { createNamer } from '../src/namer'

describe('namer', () => {
  test('handle basic strings', ({ expect }) => {
    const namer = createNamer()

    expect(namer.variable('test')).toBe('test_0')
    expect(namer.variable('test')).toBe('test_1')

    expect(namer.constant('test')).toBe('TEST_0')
    expect(namer.constant('test')).toBe('TEST_1')

    expect(namer.attribute('test')).toBe('a_test_0')
    expect(namer.attribute('test')).toBe('a_test_1')

    expect(namer.uniform('test')).toBe('u_test_0')
    expect(namer.uniform('test')).toBe('u_test_1')

    expect(namer.varying('test')).toBe('v_test_0')
    expect(namer.varying('test')).toBe('v_test_1')
  })

  test('strip whitespace and symbols', ({ expect }) => {
    const namer = createNamer()

    expect(namer.variable('the test$')).toBe('thetest_0')
    expect(namer.constant('the test$')).toBe('THETEST_0')
    expect(namer.attribute('the test$')).toBe('a_thetest_0')
    expect(namer.uniform('the test$')).toBe('u_thetest_0')
    expect(namer.varying('the test$')).toBe('v_thetest_0')
  })

  test('handle leading numbers', ({ expect }) => {
    const namer = createNamer()

    expect(namer.variable('0_the_test')).toBe('_0_the_test_0')
    expect(namer.constant('0_the_test')).toBe('_0_THE_TEST_0')
    expect(namer.attribute('0_the_test')).toBe('a_0_the_test_0')
    expect(namer.uniform('0_the_test')).toBe('u_0_the_test_0')
    expect(namer.varying('0_the_test')).toBe('v_0_the_test_0')
  })
})
