# Airaindance 视频工作流 MCP

提供确定性、只读的 MCP 工具和 OpenClaw Skill，用于规划受 Raindance 社交视频趋势启发的原创短视频：撰写视觉创意简报、安排 11 段分镜、检查提示词与授权风险，并查找 Airaindance 官方页面。

工具只处理用户输入的文字，不会读取或上传照片、生成或提交视频、调用 AI 服务商、访问账户或消耗积分；也不会复刻现有表演、编舞、画面、歌词或录音。Airaindance 是独立项目，与 Dave、Tems、TikTok、Instagram 及其权利方无隶属或背书关系。

## 安装

```bash
npx -y github:gpt-img-2/airaindance-video-workflow-mcp
```

## MCP 工具

- `build_raindance_video_brief`：把原创想法整理成带授权检查的视觉提示词。
- `plan_raindance_storyboard`：生成 11 段定时分镜，并检查总时长。
- `audit_raindance_prompt`：提示缺失的授权，以及复制受保护作品的风险。
- `get_airaindance_resources`：返回官方公开页面与 Skill 原始文件地址。

## OpenClaw

```bash
openclaw mcp add airaindance-video \
  --command npx \
  --arg -y \
  --arg github:gpt-img-2/airaindance-video-workflow-mcp \
  --include 'build_raindance_video_brief,plan_raindance_storyboard,audit_raindance_prompt,get_airaindance_resources'
```

Skill 文件：[raindance-video-storyboard-director](openclaw/raindance-video-storyboard-director/SKILL.md)。

## 开发与验证

```bash
pnpm install
pnpm validate
```

官方项目信息：[airaindance.video/llms.txt](https://airaindance.video/llms.txt)。
