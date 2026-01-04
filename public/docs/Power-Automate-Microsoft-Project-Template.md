# Power Automate Flow Template: Microsoft Project → Nexus Integration

This guide provides step-by-step instructions to create a Power Automate flow that syncs Microsoft Project data to Nexus on a schedule.

---

## Prerequisites

1. **Microsoft 365 account** with Power Automate access
2. **Microsoft Project Online** or Project for the Web
3. **Nexus webhook secret** (configured in your Nexus environment)

---

## Flow Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Recurrence    │────▶│  Get Projects    │────▶│  Get Tasks      │
│   (Schedule)    │     │  from MS Project │     │  for each       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Nexus Webhook  │◀────│  Transform Data  │◀────│  Calculate KPIs │
│  HTTP POST      │     │  to JSON         │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Step-by-Step Setup

### Step 1: Create a New Flow

1. Go to [Power Automate](https://make.powerautomate.com)
2. Click **Create** → **Scheduled cloud flow**
3. Name it: `Nexus - Microsoft Project Sync`
4. Set schedule:
   - **Start**: Today
   - **Repeat every**: 1 Hour (or your preferred interval)
5. Click **Create**

---

### Step 2: Initialize Variables

Add these actions after the trigger:

#### Action: Initialize variable - Projects Array
- **Name**: `projectsArray`
- **Type**: Array
- **Value**: `[]`

#### Action: Initialize variable - Tasks Array
- **Name**: `tasksArray`
- **Type**: Array
- **Value**: `[]`

#### Action: Initialize variable - KPIs Array
- **Name**: `kpisArray`
- **Type**: Array
- **Value**: `[]`

---

### Step 3: Get Projects from Microsoft Project

#### For Project for the Web:

**Action**: Dataverse - List rows
- **Table name**: Projects (msdyn_project)
- **Select columns**: 
  ```
  msdyn_projectid,msdyn_subject,msdyn_description,msdyn_scheduledstart,msdyn_scheduledend,msdyn_progress,msdyn_projectstatus
  ```

#### For Project Online:

**Action**: SharePoint - Send an HTTP request to SharePoint
- **Site Address**: Your Project Web App URL
- **Method**: GET
- **Uri**: `/_api/ProjectData/Projects`
- **Headers**:
  ```json
  {
    "Accept": "application/json;odata=verbose"
  }
  ```

---

### Step 4: Loop Through Projects

**Action**: Apply to each
- **Select output**: Projects from previous step

Inside the loop, add:

#### Action: Append to array variable
- **Name**: `projectsArray`
- **Value**:
```json
{
  "external_id": "@{items('Apply_to_each')?['msdyn_projectid']}",
  "name": "@{items('Apply_to_each')?['msdyn_subject']}",
  "description": "@{items('Apply_to_each')?['msdyn_description']}",
  "health": "@{if(greater(items('Apply_to_each')?['msdyn_progress'], 80), 'on-track', if(greater(items('Apply_to_each')?['msdyn_progress'], 50), 'at-risk', 'critical'))}",
  "progress": "@{items('Apply_to_each')?['msdyn_progress']}",
  "start_date": "@{items('Apply_to_each')?['msdyn_scheduledstart']}",
  "end_date": "@{items('Apply_to_each')?['msdyn_scheduledend']}",
  "priority": "medium",
  "category": "Microsoft Project"
}
```

---

### Step 5: Get Tasks for Each Project

Inside the same loop, add:

**Action**: Dataverse - List rows (for tasks)
- **Table name**: Project Tasks (msdyn_projecttask)
- **Filter rows**: `_msdyn_project_value eq '@{items('Apply_to_each')?['msdyn_projectid']}'`

**Action**: Apply to each (nested) - Tasks
- **Select output**: Tasks from previous step

#### Action: Append to array variable
- **Name**: `tasksArray`
- **Value**:
```json
{
  "external_id": "@{items('Apply_to_each_-_Tasks')?['msdyn_projecttaskid']}",
  "title": "@{items('Apply_to_each_-_Tasks')?['msdyn_subject']}",
  "description": "@{items('Apply_to_each_-_Tasks')?['msdyn_description']}",
  "status": "@{if(equals(items('Apply_to_each_-_Tasks')?['msdyn_progress'], 100), 'done', if(greater(items('Apply_to_each_-_Tasks')?['msdyn_progress'], 0), 'in-progress', 'todo'))}",
  "priority": "@{if(equals(items('Apply_to_each_-_Tasks')?['msdyn_priority'], 1), 'high', if(equals(items('Apply_to_each_-_Tasks')?['msdyn_priority'], 2), 'medium', 'low'))}",
  "due_date": "@{items('Apply_to_each_-_Tasks')?['msdyn_scheduledend']}",
  "project_external_id": "@{items('Apply_to_each')?['msdyn_projectid']}"
}
```

---

### Step 6: Calculate KPIs

After the project loop, add these Compose actions:

#### Action: Compose - Total Projects
```json
{
  "title": "Total Projects",
  "value": "@{length(variables('projectsArray'))}",
  "icon": "Briefcase",
  "trend": "up",
  "change": 0
}
```

#### Action: Compose - Active Tasks
```json
{
  "title": "Active Tasks",
  "value": "@{length(filter(variables('tasksArray'), item()?['status'], 'in-progress'))}",
  "icon": "CheckSquare",
  "trend": "up",
  "change": 0
}
```

#### Action: Compose - On Track Projects
```json
{
  "title": "On Track",
  "value": "@{concat(string(div(mul(length(filter(variables('projectsArray'), item()?['health'], 'on-track')), 100), max(length(variables('projectsArray')), 1))), '%')}",
  "icon": "TrendingUp",
  "trend": "up",
  "change": 5
}
```

#### Action: Compose - Overdue Tasks
```json
{
  "title": "Overdue Tasks",
  "value": "@{length(filter(variables('tasksArray'), item()?['status'], 'todo'))}",
  "icon": "AlertCircle",
  "trend": "down",
  "change": -2
}
```

#### Action: Append all KPIs to array
- Add each Compose output to `kpisArray`

---

### Step 7: Send to Nexus Webhook

**Action**: HTTP
- **Method**: POST
- **URI**: 
  ```
  https://ixkknbhlbafeucgmafpk.supabase.co/functions/v1/sync-project-data
  ```
- **Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "x-webhook-secret": "YOUR_WEBHOOK_SECRET_HERE"
  }
  ```
- **Body**:
  ```json
  {
    "source": "microsoft-project",
    "projects": @{variables('projectsArray')},
    "tasks": @{variables('tasksArray')},
    "kpis": @{variables('kpisArray')}
  }
  ```

---

### Step 8: Add Error Handling (Optional but Recommended)

Wrap the HTTP action in a **Scope** and add:

**Action**: Compose - Error Log (on failure)
```json
{
  "timestamp": "@{utcNow()}",
  "error": "@{result('HTTP')?['error']?['message']}",
  "status": "failed"
}
```

**Action**: Send email notification (on failure)
- To: Your admin email
- Subject: `Nexus Sync Failed - @{utcNow()}`
- Body: Error details

---

## Complete Flow JSON Export

You can import this flow definition directly into Power Automate:

```json
{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "triggers": {
      "Recurrence": {
        "type": "Recurrence",
        "recurrence": {
          "frequency": "Hour",
          "interval": 1
        }
      }
    },
    "actions": {
      "Initialize_projectsArray": {
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            {
              "name": "projectsArray",
              "type": "array",
              "value": []
            }
          ]
        },
        "runAfter": {}
      },
      "Initialize_tasksArray": {
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            {
              "name": "tasksArray",
              "type": "array",
              "value": []
            }
          ]
        },
        "runAfter": {
          "Initialize_projectsArray": ["Succeeded"]
        }
      },
      "Initialize_kpisArray": {
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            {
              "name": "kpisArray",
              "type": "array",
              "value": []
            }
          ]
        },
        "runAfter": {
          "Initialize_tasksArray": ["Succeeded"]
        }
      }
    }
  }
}
```

---

## Testing the Flow

1. **Manual Test**: Click "Test" → "Manually" → "Test"
2. **Check Nexus Dashboard**: Look for the "Live Data" badge
3. **Verify Data**: Check that projects and tasks appear correctly

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Verify `x-webhook-secret` header matches your configured secret |
| 400 Bad Request | Check JSON payload structure matches expected format |
| No data appearing | Ensure Microsoft Project connector has proper permissions |
| Partial data | Check for null values in required fields |

---

## Alternative: n8n Workflow

If using n8n instead of Power Automate:

```json
{
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 1 }]
        }
      }
    },
    {
      "name": "Microsoft Graph API",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://graph.microsoft.com/v1.0/me/planner/plans",
        "authentication": "oAuth2",
        "method": "GET"
      }
    },
    {
      "name": "Transform Data",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "return items.map(item => ({ json: { external_id: item.json.id, name: item.json.title } }))"
      }
    },
    {
      "name": "Send to Nexus",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://ixkknbhlbafeucgmafpk.supabase.co/functions/v1/sync-project-data",
        "method": "POST",
        "headers": {
          "x-webhook-secret": "={{$env.NEXUS_WEBHOOK_SECRET}}"
        },
        "body": "={{ JSON.stringify({ source: 'microsoft-project', projects: $json }) }}"
      }
    }
  ]
}
```

---

## Security Best Practices

1. **Store secrets securely**: Use Power Automate's secure inputs for the webhook secret
2. **Limit permissions**: Grant only necessary Microsoft Project permissions
3. **Monitor runs**: Set up alerts for failed flow runs
4. **Rotate secrets**: Periodically update the webhook secret

---

## Next Steps

- [ ] Create the flow in Power Automate
- [ ] Configure your webhook secret in Nexus
- [ ] Test with a single project first
- [ ] Enable the schedule once verified
- [ ] Set up monitoring alerts
