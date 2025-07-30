import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock fabric.js
jest.mock('fabric', () => ({
  Canvas: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    renderAll: jest.fn(),
    setActiveObject: jest.fn(),
    getActiveObject: jest.fn(),
    getZoom: jest.fn(() => 1),
    setZoom: jest.fn(),
    setViewportTransform: jest.fn(),
    bringToFront: jest.fn(),
    sendToBack: jest.fn(),
    dispose: jest.fn(),
  })),
  Image: {
    fromURL: jest.fn((url, callback) => {
      callback({
        scaleToWidth: jest.fn(),
        set: jest.fn(),
        on: jest.fn(),
      })
    }),
  },
}))

// Mock react-webcam
jest.mock('react-webcam', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getScreenshot: jest.fn(() => 'data:image/jpeg;base64,mock'),
  })),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()