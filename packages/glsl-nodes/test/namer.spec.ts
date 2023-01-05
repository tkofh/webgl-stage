import { describe, test } from 'vitest'
import { createNamer } from '../src/namer'

describe('namer', () => {
  test('handle basic strings', ({ expect }) => {
    const namer = createNamer()

    expect(namer.variable('test')).toBe('test__0')
    expect(namer.variable('test')).toBe('test__1')

    expect(namer.constant('test')).toBe('TEST__0')
    expect(namer.constant('test')).toBe('TEST__1')

    expect(namer.attribute('test')).toBe('a_test__0')
    expect(namer.attribute('test')).toBe('a_test__1')

    expect(namer.uniform('test')).toBe('u_test__0')
    expect(namer.uniform('test')).toBe('u_test__1')

    expect(namer.varying('test')).toBe('v_test__0')
    expect(namer.varying('test')).toBe('v_test__1')
  })

  test('strip whitespace and symbols', ({ expect }) => {
    const namer = createNamer()

    expect(namer.variable('the test$')).toBe('thetest__0')
    expect(namer.constant('the test$')).toBe('THETEST__0')
    expect(namer.attribute('the test$')).toBe('a_thetest__0')
    expect(namer.uniform('the test$')).toBe('u_thetest__0')
    expect(namer.varying('the test$')).toBe('v_thetest__0')
  })

  test('handle leading numbers', ({ expect }) => {
    const namer = createNamer()

    expect(namer.variable('0_the_test')).toBe('_0_the_test__0')
    expect(namer.constant('0_the_test')).toBe('_0_THE_TEST__0')
    expect(namer.attribute('0_the_test')).toBe('a_0_the_test__0')
    expect(namer.uniform('0_the_test')).toBe('u_0_the_test__0')
    expect(namer.varying('0_the_test')).toBe('v_0_the_test__0')
  })
})
