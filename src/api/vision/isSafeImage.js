import visionApi, { Image, Feature, Request} from 'node-cloud-vision-api';

const isSafeForCategory = categoryRating => categoryRating === 'UNLIKELY' || categoryRating === 'VERY_UNLIKELY' || categoryRating === 'POSSIBLE';

export default config => imageAsBuffer => {
    visionApi.init(config);

    const request = new Request({
        image: new Image({
            base64: imageAsBuffer.toString('base64'),
        }),
        features: [
            new Feature('SAFE_SEARCH_DETECTION'),
        ],
    });

    return visionApi.annotate(request)
        .then(({ responses }) => {
            if (!responses || responses.length === 0) {
                return false;
            }

            // We requested only one feature so we should have only one response
            const response = responses[0];

            if (!response.safeSearchAnnotation) {
                return false;
            }

            // safeSearchAnnotation format: https://cloud.google.com/vision/reference/rest/v1/images/annotate#SafeSearchAnnotation
            // possible values for adult, spoof, medical and violence: https://cloud.google.com/vision/reference/rest/v1/images/annotate#Likelihood

            return isSafeForCategory(response.safeSearchAnnotation.adult) &&
                isSafeForCategory(response.safeSearchAnnotation.spoof) &&
                isSafeForCategory(response.safeSearchAnnotation.medical) &&
                isSafeForCategory(response.safeSearchAnnotation.violence);
        }).catch(err => {
            console.error(err);
            return false;
        });
};
