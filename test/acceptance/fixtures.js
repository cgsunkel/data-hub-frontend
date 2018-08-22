/**
 * Easily reference fixtures provided to the UAT tests
 * @type {}
 */
module.exports = {
  company: {
    companiesHouse: {
      name: 'Exobite Skeletons Ltd',
      address1: '999 Juliet Street',
      town: 'Llangefni',
      postcode: 'LL77 5RN',
      country: 'United Kingdom',
    },
    foreign: {
      id: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
      name: 'Lambda plc',
      address1: '12 St George\'s Road',
      town: 'Paris',
      postcode: '75001',
      country: 'France',
      primaryAddress: '12 St George\'s Road, Paris, 75001, France',
      businessType: 'Company',
      headquarterType: 'Not a headquarters',
      sector: 'Retail',
      description: 'This is a dummy company for testing',
      employeeRange: '500+',
      turnoverRange: '£33.5M+',
      currentlyExportingTo: 'France, Germany',
      futureCountriesOfInterest: 'Yemen',
    },
    foreignOther: {
      id: 'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
      name: 'Mars Exports Ltd',
      address1: '12 First Street',
      town: 'New York',
      postcode: '765413',
      country: 'United States',
    },
    ukLtd: {
      id: '0f5216e0-849f-11e6-ae22-56b6b6499611',
      name: 'Venus Ltd',
      address1: '66 Marcham Road',
      town: 'Bordley',
      postcode: 'BD23 8RZ',
      country: 'United Kingdom',
      primaryAddress: '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
      ukRegion: 'North West',
      headquarterType: 'Not a headquarters',
      sector: 'Retail',
      description: 'This is a dummy company for testing',
      referenceCode: 'ORG-10096257',
    },
    oneList: {
      id: '375094ac-f79a-43e5-9c88-059a7caa17f0',
      name: 'One List Corp',
      address1: '12 St George\'s Road',
      town: 'Paris',
      postcode: '75001',
      country: 'France',
      primaryAddress: '12 St George\'s Road, Paris, 75001, France',
      businessType: 'Company',
      headquarterType: 'Global HQ',
      sector: 'Retail',
      description: 'This is a dummy company for testing the One List',
      employeeRange: '500+',
      turnoverRange: '£33.5M+',
    },
    archived: {
      id: '346f78a5-1d23-4213-b4c2-bf48246a13c3',
      name: 'Archived Ltd',
      address1: '16 Getabergsvagen',
      town: 'Geta',
      postcode: '22340',
      country: 'Aland Islands',
      primaryAddress: '16 Getabergsvagen, Geta, 22340, Aland Islands',
      businessType: 'Company',
      headquarterType: 'Global HQ',
      sector: 'Retail',
      description: 'This is a dummy company for testing archived features',
      employeeRange: '500+',
      turnoverRange: '£33.5M+',
    },
  },
  contact: {
    georginaClark: {
      id: '048f2edc-e7ed-4881-b1cc-29142a80238a',
      name: 'Georgina Clark',
    },
    johnnyCakeman: {
      id: '9b1138ab-ec7b-497f-b8c3-27fed21694ef',
      name: 'Johnny Cakeman',
    },
    deanCox: {
      id: '952232d2-1d25-4c3a-bcac-2f3a30a94da9',
      name: 'Dean Cox',
    },
  },
  event: {
    oneDayExhibition: {
      id: 'b93d4273-36fe-4008-ac40-fbc197910791',
      name: 'One-day exhibition',
    },
    grandExhibition: {
      id: 'bda12a57-433c-4a0c-a7ce-5ebd080e09e8',
      name: 'Grand exhibition',
    },
    teddyBearExpo: {
      id: 'b93d4274-36fe-4008-ac40-fbc197910791',
      name: 'Teddy bear expo',
    },
  },
  interaction: {
    attendedGammaEvent: {
      id: 'ec4a46ef-6e50-4a5c-bba0-e311f0471312',
      company: 'Venus Ltd',
      contact: 'Johnny Cakeman',
      serviceProvider: 'CBBC North EAST',
      service: 'Events - UK Based',
      subject: 'Attended gamma event',
      name: 'Attended gamma event',
      notes: 'This is a dummy service delivery for testing',
      date: '5 September 2017',
      ditAdviser: 'Puck Head',
      event: 'Grand exhibition',
      documents: 'View files and documents (will open another website)',
    },
    grandExhibition: {
      id: '0dcb3748-c097-4f20-b84f-0114bbb1a8e0',
      subject: 'Provided funding information',
    },
    tapGrant: {
      id: 'aa350238-5d84-4bed-be68-b08dea7ea6d5',
      company: 'Venus Ltd',
      contact: 'Dean Cox',
      serviceProvider: 'Marketing - Marketing Team',
      service: 'Tradeshow Access Programme (TAP)',
      serviceStatus: 'Offered',
      grantOffered: '£2,500.00',
      subject: 'TAP grant',
      name: 'TAP grant',
      notes: 'This is a dummy service delivery for testing',
      date: '15 September 2017',
      ditAdviser: 'John Rogers',
      event: 'No',
      documents: 'There are no files or documents',
    },
    providedFundingInformation: {
      id: '0dcb3748-c097-4f20-b84f-0114bbb1a8e0',
      name: 'Provided funding information',
    },
  },
  investmentProject: {
    newHotelCommitmentToInvest: {
      id: 'fb5b5006-56af-40e0-8615-7aba53e0e4bf',
      name: 'New hotel (commitment to invest)',

      proposition: {
        id: '7d68565a-fc0e-422c-8ce3-df92cd40a64a',
        investment_project: {
          name: 'investment project example',
          project_code: 'DHP-00000001',
          id: '65e77d82-8ebb-4ee7-b6ac-8c5945c512db',
        },
        adviser: {
          first_name: 'Joseph',
          last_name: 'Wright of Derby ',
          name: 'Joseph Wright of Derby',
          id: '14d9f881-4df4-421b-8181-874f9dc83b76',
        },
        deadline: '2018-05-20',
        status: 'ongoing',
        name: 'Game-changing Proposition',
        scope: 'scope 0',
        reason_abandoned: 'All the world`s a stage, and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.',
        modified_on: '2018-05-03T09:49:03.038168Z',
        modified_by: {
          first_name: 'Francisco',
          last_name: 'Goya',
          name: 'Francisco Goya',
          id: '67ac0071-5d7b-4fc7-a437-929d18e2e82a',
        },
        created_on: '2018-05-09',
      },
    },
    newRollercoaster: {
      id: '0e686ea4-b8a2-4337-aec4-114d92ad4588',
      name: 'New rollercoaster',
    },
    newHotelFdi: {
      id: '721e2a04-21c3-4172-a321-4368463a4b2d',
      name: 'New hotel (FDI)',
    },
    newGolfCourse: {
      id: 'e32b3c33-80ac-4589-a8c4-dda305d726ba',
      name: 'New golf course (DA)',
      clientRelationshipManager: {
        name: 'Paula Churing',
        team: 'Marketing - Marketing Team',
      },
    },
    newZoo: {
      id: 'ba1f0b14-5fe4-4c36-bf6a-ddf115272977',
      name: 'New zoo (LEP)',
      clientRelationshipManager: {
        name: 'Paula Churing',
        team: 'Marketing - Marketing Team',
      },
    },
    fancyDressManufacturing: {
      id: 'b30dee70-b2d6-48cf-9ce4-b9264854470c',
      name: 'Fancy dress manufacturing',
      clientRelationshipManager: {
        name: 'Puck Head',
        team: 'CBBC North EAST',
      },
      globalAccountManager: {
        name: 'Travis Greene',
      },
    },
  },
  proposition: {
    gameChangingProposition: {
      id: '7d68565a-fc0e-422c-8ce3-df92cd40a64a',
      investment_project: {
        name: 'investment project example',
        project_code: 'DHP-00000001',
        id: '65e77d82-8ebb-4ee7-b6ac-8c5945c512db',
      },
      adviser: {
        first_name: 'Joseph',
        last_name: 'Wright of Derby ',
        name: 'Joseph Wright of Derby',
        id: '14d9f881-4df4-421b-8181-874f9dc83b76',
      },
      deadline: '2018-05-20',
      status: 'ongoing',
      name: 'Game-changing Proposition',
      scope: 'scope 0',
      reason_abandoned: 'All the world`s a stage, and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.',
      modified_on: '2018-05-03T09:49:03.038168Z',
      modified_by: {
        first_name: 'Francisco',
        last_name: 'Goya',
        name: 'Francisco Goya',
        id: '67ac0071-5d7b-4fc7-a437-929d18e2e82a',
      },
      created_on: '2018-05-09',
    },
  },

  order: {
    // TODO: Populate with UUIDs when fixtures have been added to the API
    draft: {
      id: '',
    },
  },
}
