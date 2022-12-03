exports.handler = async function(event: any, context: { logStreamName: any }) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    return context.logStreamName
}