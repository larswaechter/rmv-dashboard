import { expect } from 'chai';

import { Alarm } from '../../src/components/alarms/model';
import { TestFactory } from '../helpers/factory';

describe('Alarms component', () => {
  const factory: TestFactory = new TestFactory();

  beforeAll((done) => {
    factory.prepare(done);
  });

  afterAll((done) => {
    factory.close(done);
  });

  it('GET /api/alarms', (done) => {
    factory.app
      .get('/api/alarms')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const alarms = res.body;

        expect(alarms).to.be.an('array');
        expect(alarms.length).eq(0);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('POST /api/alarms', (done) => {
    factory.app
      .post('/api/alarms')
      .send(factory.dummyAlarm)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
        const alarm: Alarm = res.body;

        expect(alarm).to.be.an('object');
        expect(alarm.id).eq(1);
        expect(alarm.journeyRef).eq(factory.dummyAlarm.journeyRef);
        expect(alarm.stationId).eq(factory.dummyAlarm.stationId);
        expect(alarm.silent).eq(factory.dummyAlarm.silent);
        expect(alarm.interval).eq(factory.dummyAlarm.interval);
        expect(alarm.autodelete).eq(factory.dummyAlarm.autodelete);
        expect(alarm.telegram).eq(factory.dummyAlarm.telegram);
        expect(alarm.discord).eq(factory.dummyAlarm.discord);
        expect(alarm.paused).eq(factory.dummyAlarm.paused);
        expect(alarm.active).eq(factory.dummyAlarm.active);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('GET /api/alarms/1', (done) => {
    factory.app
      .get('/api/alarms/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const alarm: Alarm = res.body;

        expect(alarm).to.be.an('object');
        expect(alarm.id).eq(1);
        expect(alarm.journeyRef).eq(factory.dummyAlarm.journeyRef);
        expect(alarm.stationId).eq(factory.dummyAlarm.stationId);
        expect(alarm.silent).eq(factory.dummyAlarm.silent);
        expect(alarm.interval).eq(factory.dummyAlarm.interval);
        expect(alarm.autodelete).eq(factory.dummyAlarm.autodelete);
        expect(alarm.telegram).eq(factory.dummyAlarm.telegram);
        expect(alarm.discord).eq(factory.dummyAlarm.discord);
        expect(alarm.paused).eq(factory.dummyAlarm.paused);
        expect(alarm.active).eq(factory.dummyAlarm.active);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('PATCH /api/alarms/1/pause', (done) => {
    factory.app
      .patch('/api/alarms/1/pause')
      .expect(204)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('GET /api/alarms/1', (done) => {
    factory.app
      .get('/api/alarms/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const alarm: Alarm = res.body;

        expect(alarm).to.be.an('object');
        expect(alarm.paused).eq(true);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('PATCH /api/alarms/1/resume', (done) => {
    factory.app
      .patch('/api/alarms/1/resume')
      .expect(204)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('GET /api/alarms/1', (done) => {
    factory.app
      .get('/api/alarms/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const alarm: Alarm = res.body;

        expect(alarm).to.be.an('object');
        expect(alarm.paused).eq(false);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('DELETE /api/alarms/1', (done) => {
    factory.app
      .delete('/api/alarms/1')
      .expect(204)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('GET /api/alarms/1', (done) => {
    factory.app
      .get('/api/alarms/1')
      .expect(404)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('DELETE /api/alarms/1', (done) => {
    factory.app
      .delete('/api/alarms/1')
      .expect(404)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
