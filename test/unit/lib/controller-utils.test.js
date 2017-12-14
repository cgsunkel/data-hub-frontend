const {
  isBlank,
  transformV2Errors,
  isValidGuid,
  getDataLabels,
} = require('~/src/lib/controller-utils')

describe('isBlank', () => {
  it('should detects undefined variables', () => {
    let e
    expect(isBlank(e)).to.be.true
  })
  it('should detect passing an unknown key', () => {
    let e = {}
    expect(isBlank(e.x)).to.be.true
  })
  it('should detect an empty string', () => {
    expect(isBlank('')).to.be.true
  })
  it('should detect undefined', () => {
    expect(isBlank(undefined)).to.be.true
  })
  it('should know when it is sent a valid string', () => {
    expect(isBlank('test')).to.be.false
  })
  it('should know when it is sent a valid object', () => {
    expect(isBlank({ x: 1 })).to.be.false
  })
})

describe('transformV2Errors: Formatting V2 service delivery endpoint errors', () => {
  it('Should warn if the Service Delivery triple does not exist', () => {
    const source = [
      {
        'detail': 'This combination of service and service provider does not exist.',
        'source': {
          'pointer': '/data/relationships/service',
        },
      },
    ]
    const actual = transformV2Errors(source)
    expect(actual.Alert).to.exist
    expect(actual.Alert).to.equal('This combination of service and service provider does not exist.')
  })
  it('Should return multiple errors when presented with an array of errors', () => {
    const source = [
      {
        'detail': 'Required',
        'source': {
          'pointer': '/data/attributes/subject',
        },
      },
      {
        'detail': 'Required',
        'source': {
          'pointer': '/data/attributes/notes',
        },
      },
      {
        'detail': "{'data': {'type': 'ServiceDeliveryStatus'}} has no key id",
        'source': {
          'pointer': '/data/relationships/status',
        },
      },
      {
        'detail': "{'data': {'type': 'Contact'}} has no key id",
        'source': {
          'pointer': '/data/relationships/contact',
        },
      },
      {
        'detail': "{'data': {'type': 'Service'}} has no key id",
        'source': {
          'pointer': '/data/relationships/service',
        },
      },
      {
        'detail': "{'data': {'type': 'Team'}} has no key id",
        'source': {
          'pointer': '/data/relationships/dit_team',
        },
      },
      {
        'detail': "{'data': {'type': 'Sector'}} has no key id",
        'source': {
          'pointer': '/data/relationships/sector',
        },
      },
      {
        'detail': "{'data': {'type': 'UKRegion'}} has no key id",
        'source': {
          'pointer': '/data/relationships/uk_region',
        },
      },
      {
        'detail': "{'data': {'type': 'Country'}} has no key id",
        'source': {
          'pointer': '/data/relationships/country_of_interest',
        },
      },
    ]
    const transformedErrors = transformV2Errors(source)
    const expectedErrors = {
      subject: 'Subject is required',
      notes: 'Notes are required',
      status: 'Status  is required',
      contact: 'Contact is required',
      service: 'Service is required',
      dit_team: 'Service provider  is required',
      sector: 'Sector is required',
      uk_region: 'UK Region  is required',
      country_of_interest: 'Country is required',
    }

    expect(transformedErrors).to.deep.equal(expectedErrors)
  })
  it('Should match keys not specially defined', () => {
    const source = [
      {
        'detail': "{'data': {'type': 'Foo'}} has no key id",
        'source': {
          'pointer': '/data/relationships/foo',
        },
      },
    ]
    const transformedErrors = transformV2Errors(source)
    const expectedErrors = { foo: 'Foo is required' }

    expect(transformedErrors).to.deep.equal(expectedErrors)
  })
})

describe('isValidGuid: Check that a string is in a format of a valid GUID', () => {
  it('should return false when something other than string is provided', () => {
    expect(isValidGuid({})).to.be.false
    expect(isValidGuid(undefined)).to.be.false
  })

  it('should return false when a string is in invalid GUID format', () => {
    expect(isValidGuid('12345')).to.be.false
    expect(isValidGuid('hjkas-1279as-dhjaskj-12jasdlk-asdasa')).to.be.false
  })

  it('should return true when a string with in a valid GUID format', () => {
    expect(isValidGuid('12345abc-1234-abcd-12ab-123456abcdef')).to.be.true
  })
})

describe('#getDataLabels', () => {
  const mockData = {
    a: 'A',
    b: 'B',
  }

  const mockLabels = {
    a: 'Label A',
    b: 'Label B',
  }

  it('should return undefined if no data if given', () => {
    expect(getDataLabels(null)).to.be.undefined
  })

  it('should return same object if labels object is not given', () => {
    expect(getDataLabels(mockData)).to.deep.equal(mockData)
  })

  it('should return same object if labels object is not given', () => {
    expect(getDataLabels(mockData, mockLabels)).to.deep.equal({
      'Label A': 'A',
      'Label B': 'B',
    })
  })
})
