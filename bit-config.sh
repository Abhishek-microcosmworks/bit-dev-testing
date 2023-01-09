bit config set analytics_reporting false
bit config set anonymous_reporting false
bit config set user.token ${BIT_TOKEN}
echo @bit:registry=https://node.bit.dev >> .npmrc
echo //node.bit.dev/:_authToken='aab3f670-3acb-4ccc-b367-1e90a9a556e6' >> .npmrc