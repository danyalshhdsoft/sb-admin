export const aggregatePaginate = async (
    model,
    pipeline,
    page = 1,
    limit = 10,
) => {
    // Convert page and limit to numbers
    const numLimit = Number(limit);
    const numPage = Number(page);

    // Execute aggregation pipeline
    const result = await model
        .aggregate([
            ...pipeline,
            {
                $facet: {
                    totalCount: [{ $count: 'total' }],
                    paginatedResults: [
                        { $skip: (numPage - 1) * numLimit },
                        { $limit: numLimit },
                    ],
                },
            },
        ])
        .then(async (result) => {
            // Extract pagination metadata and paginated results
            const totalCount = result[0].totalCount[0]
                ? result[0].totalCount[0].total
                : 0;
            const paginatedResults = result[0].paginatedResults || [];
            const totalPages = Math.ceil(totalCount / numLimit);
            const currentPage = numPage;

            // Return paginated data along with metadata
            return {

                totalCount,
                totalPages,
                currentPage,
                paging: {
                    limit: numLimit,
                    count: paginatedResults.length,
                },
                list: paginatedResults,
            };
        })
        .catch((err) => {
            console.error(err);
        });

    return result;
};
