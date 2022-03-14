import { TestBed } from '@angular/core/testing'

import { LogicFilterService } from './logic-filter.service'

describe('FileUploadService', () => {
  let service: LogicFilterService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LogicFilterService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
