import { TestBed } from '@angular/core/testing'

import { XSLXFileService } from './xlsx-file.service'

describe('FileUploadService', () => {
  let service: XSLXFileService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(XSLXFileService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
