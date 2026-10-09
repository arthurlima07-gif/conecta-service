import 'reflect-metadata';

import { beforeEach, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = moduleRef.get(AppController);
  });

  it('deve retornar Hello World!', () => {
    expect(appController.getHello()).toBe('Hello World!');
  });
});