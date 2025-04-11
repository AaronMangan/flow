<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} - Notification</title>
    <style>
        body {
            font-family: Tahoma, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 900px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 0;
            color: #333;
        }
        .content {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 15px;
            background: #3490dc;
            color: #ffffff;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            font-family: Tahoma, sans-serif;
            color: #777;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">{{ config('app.name') }}</div>
        
        <div class="content">
            <p>Hi {{ $details['addressee'] ?? $details['to'] }},</p>
            
            @if(isset($details['from']))
                <p>{{$details['from']}} has re-issued the following transmittal to you:</p>
                <p>{{ $details['body'] }}</p>
            @endif

            @if(isset($transmittal->documents) && $transmittal->documents->count() > 0)
                <div style="border: 1px solid #ddd; border-radius: 10px; overflow: hidden; width: 100%; max-width: 900px; margin: 5px auto;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" 
                        style="border-collapse: collapse; width: 100%; font-family: Tahoma, sans-serif;">
                        <thead>
                            <tr style="background-color: #f3f4f6; text-align: left;">
                                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Document #</th>
                                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Rev.</th>
                                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($transmittal->documents()->limit($details['limit'])->get() as $doc)
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $doc['document_number'] }}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $doc['revision']['code'] ?? $doc['revision_id'] }}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $doc['name'] }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
            @if(isset($details['action']) && is_array($details['action']))
                <p style="text-align: center;">
                    <a href="{{ $details['action']['url'] }}" class="button">{{ $details['action']['label'] ?? 'Take Action' }}</a>
                </p>
            @endif
        </div>

        <div class="footer">
            <p>Thanks for using {{ config('app.name') }}!</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
