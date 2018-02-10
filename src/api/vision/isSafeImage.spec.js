/* eslint-disable func-names */

import { expect } from 'chai';
import sinon from 'sinon';
import isSafeImageFactory from './isSafeImage';
import visionApi from 'node-cloud-vision-api';

describe('Vision API', () => {
    describe('isSafeImage', () => {
        sinon.stub(visionApi, 'init', () => {});

        afterEach(() => {
            visionApi.annotate.restore();
        });

        it('should return false if unable to request Vision API', function* () {
            sinon.stub(visionApi, 'annotate', () => Promise.reject(new Error('Test error for Vision API unreachable')));
            const isSafeImage = isSafeImageFactory();
            const result = yield isSafeImage('test');
            expect(result).to.equal(false);
        });

        it('should return false if response does not match expected format', function* () {
            sinon.stub(visionApi, 'annotate', () => Promise.resolve({
            }));
            const isSafeImage = isSafeImageFactory();
            const result = yield isSafeImage('test');
            expect(result).to.equal(false);
        });

        it('should return false if first response does a safeSearchAnnotation key', function* () {
            sinon.stub(visionApi, 'annotate', () => Promise.resolve({
                responses: [{}],
            }));
            const isSafeImage = isSafeImageFactory();
            const result = yield isSafeImage('test');
            expect(result).to.equal(false);
        });

        it('should return false if safeSearchAnnotation.adult is neither UNLIKELY, VERY_UNLIKELY or POSSIBLE', function* () {
            sinon.stub(visionApi, 'annotate', () => Promise.resolve({
                responses: [{
                    safeSearchAnnotation: {
                        adult: 'LIKELY',
                        spoof: 'UNLIKELY',
                        medical: 'POSSIBLE',
                        violence: 'VERY_UNLIKELY',
                    },
                }],
            }));
            const isSafeImage = isSafeImageFactory();
            const result = yield isSafeImage('test');
            expect(result).to.equal(false);
        });

        it('should return false if safeSearchAnnotation.spoof is neither UNLIKELY, VERY_UNLIKELY or POSSIBLE', function* () {
            sinon.stub(visionApi, 'annotate', () => Promise.resolve({
                responses: [{
                    safeSearchAnnotation: {
                        adult: 'UNLIKELY',
                        spoof: 'LIKELY',
                        medical: 'POSSIBLE',
                        violence: 'VERY_UNLIKELY',
                    },
                }],
            }));
            const isSafeImage = isSafeImageFactory();
            const result = yield isSafeImage('test');
            expect(result).to.equal(false);
        });

        it('should return false if safeSearchAnnotation.medical is neither UNLIKELY, VERY_UNLIKELY or POSSIBLE', function* () {
            sinon.stub(visionApi, 'annotate', () => Promise.resolve({
                responses: [{
                    safeSearchAnnotation: {
                        adult: 'POSSIBLE',
                        spoof: 'VERY_UNLIKELY',
                        medical: 'LIKELY',
                        violence: 'UNLIKELY',
                    },
                }],
            }));
            const isSafeImage = isSafeImageFactory();
            const result = yield isSafeImage('test');
            expect(result).to.equal(false);
        });

        it('should return false if safeSearchAnnotation.violence is neither UNLIKELY, VERY_UNLIKELY or POSSIBLE', function* () {
            sinon.stub(visionApi, 'annotate', () => Promise.resolve({
                responses: [{
                    safeSearchAnnotation: {
                        adult: 'UNLIKELY',
                        spoof: 'VERY_UNLIKELY',
                        medical: 'POSSIBLE',
                        violence: 'LIKELY',
                    },
                }],
            }));
            const isSafeImage = isSafeImageFactory();
            const result = yield isSafeImage('test');
            expect(result).to.equal(false);
        });

        it('should return true if all safeSearchAnnotation categories are either UNLIKELY, VERY_UNLIKELY or POSSIBLE', function* () {
            sinon.stub(visionApi, 'annotate', () => Promise.resolve({
                responses: [{
                    safeSearchAnnotation: {
                        adult: 'UNLIKELY',
                        spoof: 'POSSIBLE',
                        medical: 'VERY_UNLIKELY',
                        violence: 'VERY_UNLIKELY',
                    },
                }],
            }));
            const isSafeImage = isSafeImageFactory();
            const result = yield isSafeImage('test');
            expect(result).to.equal(true);
        });
    });
});
