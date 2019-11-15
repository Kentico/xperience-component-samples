import { getLinkInfo } from "../link-helpers";

describe("getPathSelectorMetadata", () => {
    const PAGE_NAME = "page1";
    const NODE_GUID = "1234567";

    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify({ name: PAGE_NAME, nodeGuid: NODE_GUID}));
    });

    it ("returns blank item if mode is Insert", async () => {
        const result = await getLinkInfo("doesntmatter", "doesntmatter");

        expect(result).toEqual({ name: "", nodeGuid: ""});
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("path is encoded", async () => {
        await getLinkInfo("/api/fooget", "path%&");

        expect(fetchMock).toHaveBeenCalledWith("/api/fooget?pageUrl=path%25%26");
    });

    describe("endpoint URL already contains query", () => {
        it("appends path parameter using ampersand", async () => {
            await getLinkInfo("/api/fooget?param1=test", "path");

            expect(fetchMock).toHaveBeenCalledWith("/api/fooget?param1=test&pageUrl=path");
        });
    });

    describe("endpoint URL doesn't contain query", () => {
        it("appends path parameter using question mark", async () => {
            await getLinkInfo("/api/fooget", "path");

            expect(fetchMock).toHaveBeenCalledWith("/api/fooget?pageUrl=path");
        });
    });

    it("doesn't produce unhandled error", async () => {
        fetchMock.resetMocks();
        fetchMock.mockReject(new Error("MyError"));
        const mockErrorConsole = jest.spyOn(global.console, "error").mockImplementation();
        const result = await getLinkInfo("/api/fooget", "path"); 

        expect(mockErrorConsole).toHaveBeenCalledWith(new Error("MyError"));
        expect(result).toEqual({ name: "", nodeGuid: ""});
    });

    it("does something", async () => {
        const result = await getLinkInfo("", "path");

        expect(result).toEqual({ name: PAGE_NAME, nodeGuid: NODE_GUID});
        expect(fetchMock).toHaveBeenCalledTimes(1);
    })
});